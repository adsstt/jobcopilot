import { NextResponse } from "next/server";
import { buildApiErrorResponse, createRequestId } from "../../../../server/apiErrors";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";
import { listUserDocuments } from "../../../../server/db/documents";

export const runtime = "nodejs";

const route = "/api/documents";

export async function GET(request: Request) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const documents = await listUserDocuments(user.id);
    return NextResponse.json({ documents }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "当前数据加载失败，请稍后重试",
      errorCode: "DOCUMENTS_LOAD_FAILED",
      status: 500,
    });
  }
}
