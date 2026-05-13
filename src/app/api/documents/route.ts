import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import { badRequest, buildApiErrorResponse, createRequestId } from "../../../../server/apiErrors";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";
import { createDocumentAsset, listReusableDocumentAssets, listUserDocuments, type DocumentKind } from "../../../../server/db/documents";
import { parseFileBuffer } from "../../../../server/parsers/documentParser";
import { getDocumentBucketName, uploadDocumentObject } from "../../../../server/storage/documents";

export const runtime = "nodejs";

const route = "/api/documents";

export async function GET(request: Request) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const url = new URL(request.url);
    if (url.searchParams.get("reusable") === "1") {
      const documents = await listReusableDocumentAssets(user.id);
      return NextResponse.json({ documents }, { headers: { "x-request-id": requestId } });
    }

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

export async function POST(request: Request) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const form = await request.formData();
    const file = form.get("file");
    const kind = normalizeKind(String(form.get("kind") || "general"));
    const title = String(form.get("title") || "").trim();

    if (!(file instanceof File)) {
      throw badRequest("Missing uploaded file.", "请选择要上传的 PDF/DOCX/TXT 文件", "DOCUMENT_FILE_REQUIRED");
    }

    const maxBytes = Number(process.env.MAX_UPLOAD_BYTES || 8 * 1024 * 1024);
    if (file.size > maxBytes) {
      throw badRequest("File too large.", `文件不能超过 ${Math.ceil(maxBytes / 1024 / 1024)} MB`, "DOCUMENT_FILE_TOO_LARGE");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await parseFileBuffer(buffer, file.type, file.name);
    const documentId = randomUUID();
    const safeName = sanitizeFileName(parsed.filename);
    const storageKey = `${user.id}/${documentId}/${safeName}`;
    const storage = await uploadDocumentObject({
      storageKey,
      buffer,
      mimeType: parsed.mimetype,
    });

    const document = await createDocumentAsset({
      id: documentId,
      userId: user.id,
      kind,
      title: title || parsed.filename,
      fileName: parsed.filename,
      mimeType: parsed.mimetype,
      fileSize: parsed.size,
      storageBucket: storage.bucket,
      storageKey: storage.storageKey,
      parsedText: parsed.text,
    });

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
          storageBucket: getDocumentBucketName(),
        },
      },
      { headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "资料上传失败，请稍后重试",
      errorCode: "DOCUMENT_UPLOAD_FAILED",
      status: 500,
    });
  }
}

function normalizeKind(value: string): DocumentKind {
  if (value === "resume" || value === "jd" || value === "general") return value;
  return "general";
}

function sanitizeFileName(value: string) {
  const extension = extname(value).toLowerCase().replace(/[^a-z0-9.]/g, "");
  const baseName = value.slice(0, value.length - extension.length);
  const asciiBase = baseName
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "")
    .slice(0, 80);

  return `${asciiBase || "upload"}${extension || ""}`;
}
