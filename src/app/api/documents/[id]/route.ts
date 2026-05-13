import { NextResponse } from "next/server";
import { badRequest, buildApiErrorResponse, createRequestId } from "../../../../../server/apiErrors";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { deleteUserDocumentAsset, getUserDocumentAsset, renameUserDocumentAsset } from "../../../../../server/db/documents";
import { deleteDocumentObject } from "../../../../../server/storage/documents";

export const runtime = "nodejs";

const route = "/api/documents/[id]";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const document = await getUserDocumentAsset(user.id, id);

    return NextResponse.json(
      {
        document: {
          id: document.id,
          kind: document.kind,
          title: document.title,
          fileName: document.fileName,
          mimeType: document.mimeType,
          fileSize: document.fileSize,
          parsedText: document.parsedText,
          parseStatus: document.parseStatus,
          parseError: document.parseError,
          updatedAt: document.updatedAt.toISOString(),
        },
      },
      { headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "资料加载失败，请稍后重试",
      errorCode: "DOCUMENT_LOAD_FAILED",
      status: 500,
    });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const title = String(body.title || "").trim();
    if (!title) {
      throw badRequest("Document title is required.", "资料名称不能为空", "DOCUMENT_TITLE_REQUIRED");
    }

    const document = await renameUserDocumentAsset(user.id, id, title);
    return NextResponse.json(
      {
        document: {
          id: document.id,
          kind: document.kind,
          title: document.title,
          fileName: document.fileName,
          mimeType: document.mimeType,
          fileSize: document.fileSize,
          parsedText: document.parsedText,
          parseStatus: document.parseStatus,
          parseError: document.parseError,
          updatedAt: document.updatedAt.toISOString(),
        },
      },
      { headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "资料重命名失败，请稍后重试",
      errorCode: "DOCUMENT_RENAME_FAILED",
      status: 400,
    });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const { id } = await params;
    const document = await getUserDocumentAsset(user.id, id);
    await deleteDocumentObject(document.storageBucket, document.storageKey);
    await deleteUserDocumentAsset(user.id, id);

    return NextResponse.json({ ok: true }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "资料删除失败，请稍后重试",
      errorCode: "DOCUMENT_DELETE_FAILED",
      status: 400,
    });
  }
}
