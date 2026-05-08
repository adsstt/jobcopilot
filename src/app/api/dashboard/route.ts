import { NextResponse } from "next/server";
import { buildApiErrorResponse, createRequestId } from "../../../../server/apiErrors";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";
import { getDashboardData } from "../../../../server/db/dashboard";

export const runtime = "nodejs";

const route = "/api/dashboard";

export async function GET(request: Request) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const dashboard = await getDashboardData(user.id);
    return NextResponse.json({ dashboard }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "当前数据加载失败，请稍后重试",
      errorCode: "DASHBOARD_LOAD_FAILED",
      status: 500,
    });
  }
}
