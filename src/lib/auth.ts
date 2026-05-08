import { AppError } from "./appErrors";
import { getAppUrl } from "./supabase/env";

export function getAuthCallbackUrl(nextPath?: string) {
  const url = new URL("/auth/callback", getAppUrl());
  if (nextPath) {
    url.searchParams.set("next", nextPath);
  }
  return url.toString();
}

export function getSafeRedirectPath(nextPath?: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/";
  }
  return nextPath;
}

export function mapAuthError(error: unknown, fallbackMessage: string) {
  if (error instanceof AppError) return error;

  const rawMessage = error instanceof Error ? error.message : String(error || "");
  const message = rawMessage.toLowerCase();

  if (message.includes("email not confirmed") || message.includes("email_not_confirmed")) {
    return new AppError({
      errorCode: "EMAIL_NOT_CONFIRMED",
      safeMessage: "邮箱尚未确认，请先完成邮箱验证",
    });
  }

  if (message.includes("invalid login credentials")) {
    return new AppError({
      errorCode: "INVALID_CREDENTIALS",
      safeMessage: "邮箱或密码不正确，请重新输入",
    });
  }

  if (message.includes("user already registered")) {
    return new AppError({
      errorCode: "USER_ALREADY_REGISTERED",
      safeMessage: "该邮箱已注册，请直接登录或找回密码",
    });
  }

  if (message.includes("password should be at least")) {
    return new AppError({
      errorCode: "WEAK_PASSWORD",
      safeMessage: "密码强度不足，请使用更长一些的密码",
    });
  }

  return new AppError({
    errorCode: "AUTH_ERROR",
    safeMessage: fallbackMessage,
  });
}
