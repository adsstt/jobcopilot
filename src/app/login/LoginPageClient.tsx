"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { AuthFeedback } from "@/components/auth/AuthFeedback";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui";
import { AppError } from "@/lib/appErrors";
import { getAuthCallbackUrl, getSafeRedirectPath, mapAuthError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

const isDevelopment = process.env.NODE_ENV === "development";

export function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => getSafeRedirectPath(searchParams.get("next")), [searchParams]);
  const callbackMessage = searchParams.get("message");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(callbackMessage);
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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) throw signInError;

      router.replace(nextPath);
      router.refresh();
    } catch (caughtError) {
      const normalized = mapAuthError(caughtError, "登录失败，请稍后再试");
      if (isDevelopment) {
        console.error("[auth-login-error]", caughtError);
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
          safeMessage: "请先填写邮箱地址，再重发确认邮件",
        })
      );
      return;
    }

    setIsResending(true);
    setError(null);
    setSuccess(null);

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
        console.error("[auth-resend-error]", caughtError);
      }
      setError(normalized);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthShell
      title="登录"
      subtitle="使用已确认邮箱的账号登录。首次注册后，请先完成邮箱确认。"
      footer={
        <>
          还没有账号？ <Link href="/signup" className="font-semibold text-slate-900">去注册</Link>
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

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">密码</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white"
            placeholder="请输入密码"
            autoComplete="current-password"
            required
          />
        </label>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "登录中..." : "登录"}
        </Button>
      </form>

      <div className="flex items-center justify-between pt-2 text-sm">
        <Link href="/forgot-password" className="text-slate-500 transition hover:text-slate-900">
          忘记密码
        </Link>
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
