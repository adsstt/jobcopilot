import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSafeRedirectPath } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = getSafeRedirectPath(requestUrl.searchParams.get("next"));
  const authError = requestUrl.searchParams.get("error_description") || requestUrl.searchParams.get("error");

  if (authError) {
    return NextResponse.redirect(new URL(`/login?message=${encodeURIComponent("邮箱确认失败，请重新尝试")}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?message=登录回调缺少必要参数", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL(`/login?message=${encodeURIComponent("登录状态恢复失败，请重新登录")}`, request.url));
  }

  return NextResponse.redirect(new URL(nextPath === "/reset-password" ? "/reset-password" : "/", request.url));
}
