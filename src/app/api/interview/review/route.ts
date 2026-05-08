import { NextRequest, NextResponse } from "next/server";
import { badRequest, buildApiErrorResponse, createRequestId } from "../../../../../server/apiErrors";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { generateSessionReview } from "../../../../../server/services/review";

export const runtime = "nodejs";

const route = "/api/interview/review";

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request);

  try {
    const body = await request.json().catch(() => ({}));
    if (!body.sessionId) {
      throw badRequest("sessionId is required", "当前操作失败，请稍后重试", "SESSION_ID_REQUIRED");
    }

    const user = await getCurrentUser();
    const review = await generateSessionReview(user.id, body.sessionId);
    return NextResponse.json({ review }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "AI 生成失败，请检查模型配置或稍后再试",
      errorCode: "REVIEW_GENERATE_FAILED",
      status: 500,
    });
  }
}
