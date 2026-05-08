import { NextResponse } from "next/server";
import { buildApiErrorResponse, createRequestId } from "../../../../../server/apiErrors";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { listInterviewReviews } from "../../../../../server/db/aiSessions";

export const runtime = "nodejs";

const route = "/api/interview/sessions";

export async function GET(request: Request) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const reviews = await listInterviewReviews(user.id);
    return NextResponse.json({ reviews }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "当前数据加载失败，请稍后重试",
      errorCode: "SESSIONS_LOAD_FAILED",
      status: 500,
    });
  }
}
