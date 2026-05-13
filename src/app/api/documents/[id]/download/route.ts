import { NextResponse } from "next/server";
import { buildApiErrorResponse, createRequestId } from "../../../../../../server/apiErrors";
import { getCurrentUser } from "../../../../../../server/auth/getCurrentUser";
import { getUserDocumentAsset } from "../../../../../../server/db/documents";
import { createDocumentDownloadUrl } from "../../../../../../server/storage/documents";

export const runtime = "nodejs";

const route = "/api/documents/[id]/download";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const document = await getUserDocumentAsset(user.id, id);
    const signedUrl = await createDocumentDownloadUrl(document.storageBucket, document.storageKey);

    return NextResponse.redirect(signedUrl, {
      headers: { "x-request-id": requestId },
    });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "文件下载失败，请稍后重试",
      errorCode: "DOCUMENT_DOWNLOAD_FAILED",
      status: 500,
    });
  }
}
