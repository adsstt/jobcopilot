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

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() },
          emailRedirectTo: getAuthCallbackUrl(),
        },
      });

      if (signUpError) throw signUpError;

      setSuccess("注册成功，确认邮件已发送，请前往邮箱完成验证");
    } catch (caughtError) {
      const normalized = mapAuthError(caughtError, "注册失败，请稍后再试");
      if (isDevelopment) {
        console.error("[auth-signup-error]", caughtError);
      }
      setError(normalized);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError(
        new AppError({
          errorCode: "EMAIL_REQUIRED",
          safeMessage: "请先填写注册邮箱，再重发确认邮件",
        })
      );
      return;
    }

    setIsResending(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: getAuthCallbackUrl(),
        },
      });

      if (resendError) throw resendError;
      setSuccess("确认邮件已重新发送，请查收邮箱");
    } catch (caughtError) {
      const normalized = mapAuthError(caughtError, "确认邮件发送失败，请稍后再试");
      if (isDevelopment) {
        console.error("[auth-signup-resend-error]", caughtError);
      }
      setError(normalized);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell
      title="注册"
      subtitle="使用邮箱密码创建正式账号。完成邮箱确认后，才能首次登录。"
      footer={
        <>
          已有账号？ <Link href="/login" className="font-semibold text-slate-900">去登录</Link>
        </>
      }
    >
      <AuthFeedback error={error} success={success} />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">昵称</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white"
            placeholder="怎么称呼你"
            autoComplete="name"
            required
          />
        </label>

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

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">密码</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white"
            placeholder="至少 6 位"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "注册中..." : "注册并发送确认邮件"}
        </Button>
      </form>

      <div className="pt-2 text-right text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="font-medium text-indigo-600 transition hover:text-indigo-700 disabled:opacity-60"
        >
          {isResending ? "发送中..." : "重发确认邮件"}
        </button>
      </div>
    </AuthShell>
  );
}
