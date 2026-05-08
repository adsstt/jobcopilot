import { NextRequest, NextResponse } from "next/server";
import { buildApiErrorResponse, createRequestId } from "../../../../server/apiErrors";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";
import { listQuestions } from "../../../../server/db/questions";

export const runtime = "nodejs";

const route = "/api/questions";

export async function GET(request: Request) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const questions = await listQuestions(user.id);
    return NextResponse.json({ questions }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "当前数据加载失败，请稍后重试",
      errorCode: "QUESTIONS_LOAD_FAILED",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const body = await request.json().catch(() => ({}));
    const questions = await listQuestions(user.id, { forceGenerate: body.action === "generate" });
    return NextResponse.json({ questions }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "AI 生成失败，请检查模型配置或稍后再试",
      errorCode: "QUESTIONS_GENERATE_FAILED",
      status: 400,
    });
  }
}
