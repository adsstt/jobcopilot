"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthFeedback } from "@/components/auth/AuthFeedback";
import { AppError } from "@/lib/appErrors";
import { getAuthCallbackUrl, mapAuthError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

const isDevelopment = process.env.NODE_ENV === "development";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: getAuthCallbackUrl("/reset-password"),
      });

      if (resetError) throw resetError;
      setSuccess("重置密码邮件已发送，请查收邮箱");
    } catch (caughtError) {
      const normalized = mapAuthError(caughtError, "密码重置邮件发送失败，请稍后再试");
      if (isDevelopment) {
        console.error("[auth-forgot-password-error]", caughtError);
      }
      setError(normalized);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="找回密码"
      subtitle="输入注册邮箱，我们会发送重置密码链接。"
      footer={
        <>
          想起密码了？ <Link href="/login" className="font-semibold text-slate-900">返回登录</Link>
        </>
      }
    >
      <AuthFeedback error={error} success={success} />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">邮箱</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "发送中..." : "发送重置邮件"}
        </Button>
      </form>
    </AuthShell>
  );
}
