"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { AuthShell } from "@/components/auth/AuthShell";
import { AuthFeedback } from "@/components/auth/AuthFeedback";
import { AppError } from "@/lib/appErrors";
import { mapAuthError } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

const isDevelopment = process.env.NODE_ENV === "development";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSessionReady, setIsSessionReady] = useState(false);

  useEffect(() => {
    let active = true;

    createClient()
      .auth.getSession()
      .then(({ data, error: sessionError }) => {
        if (!active) return;
        if (sessionError || !data.session) {
          setError(
            new AppError({
              errorCode: "RESET_SESSION_REQUIRED",
              safeMessage: "重置链接已失效，请重新申请密码重置",
            })
          );
          return;
        }
        setIsSessionReady(true);
      })
      .catch((caughtError) => {
        if (!active) return;
        if (isDevelopment) {
          console.error("[auth-reset-session-error]", caughtError);
        }
        setError(
          new AppError({
            errorCode: "RESET_SESSION_ERROR",
            safeMessage: "当前无法验证重置状态，请重新申请密码重置",
          })
        );
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError(
        new AppError({
          errorCode: "PASSWORD_MISMATCH",
          safeMessage: "两次输入的密码不一致，请重新确认",
        })
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      setSuccess("密码已重置成功，正在返回登录页");
      setTimeout(() => {
        router.replace("/login?message=密码已重置，请使用新密码登录");
        router.refresh();
      }, 1200);
    } catch (caughtError) {
      const normalized = mapAuthError(caughtError, "密码重置失败，请稍后再试");
      if (isDevelopment) {
        console.error("[auth-reset-password-error]", caughtError);
      }
      setError(normalized);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="重置密码"
      subtitle="设置一个新的登录密码。"
      footer={
        <>
          <Link href="/login" className="font-semibold text-slate-900">返回登录</Link>
        </>
      }
    >
      <AuthFeedback error={error} success={success} />

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">新密码</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white"
            placeholder="至少 6 位"
            autoComplete="new-password"
            minLength={6}
            required
            disabled={!isSessionReady || isSubmitting}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">确认新密码</span>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-300 focus:bg-white"
            placeholder="再次输入新密码"
            autoComplete="new-password"
            minLength={6}
            required
            disabled={!isSessionReady || isSubmitting}
          />
        </label>

        <Button type="submit" className="w-full" disabled={!isSessionReady || isSubmitting}>
          {isSubmitting ? "提交中..." : "更新密码"}
        </Button>
      </form>
    </AuthShell>
  );
}
