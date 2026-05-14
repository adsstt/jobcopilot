import { badRequest } from "../apiErrors";
import { prisma } from "./client";

export type DocumentKind = "resume" | "jd" | "general";

export interface CreateDocumentAssetInput {
  id: string;
  userId: string;
  kind: DocumentKind;
  title: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  storageBucket: string;
  storageKey: string;
  parsedText: string;
}

export async function createDocumentAsset(input: CreateDocumentAssetInput) {
  try {
    return await prisma.documentAsset.create({
      data: {
        id: input.id,
        userId: input.userId,
        kind: input.kind,
        title: input.title,
        fileName: input.fileName,
        mimeType: input.mimeType,
        fileSize: input.fileSize,
        storageBucket: input.storageBucket,
        storageKey: input.storageKey,
        parsedText: input.parsedText,
        parseStatus: "parsed",
      },
    });
  } catch (error) {
    if (isMissingDocumentAssetTable(error)) {
      throw badRequest(
        "DocumentAsset table is missing.",
        "数据库还没完成资料中心迁移，请先执行 `npm run db:migrate` 或 `npx prisma migrate deploy`",
        "DOCUMENT_ASSET_TABLE_MISSING"
      );
    }
    throw error;
  }
}

export async function listUserDocuments(userId: string) {
  const assets = await listDocumentAssetsSafe(userId);

  return assets
    .map((asset) => ({
      id: asset.id,
      source: "asset" as const,
      kind: asset.kind,
      type: kindLabel(asset.kind),
      title: cleanTitle(asset.title || asset.fileName),
      fileName: asset.fileName,
      mimeType: asset.mimeType,
      track: "资料中心",
      status: asset.parseStatus === "parsed" ? "已解析" : "解析失败",
      updated: asset.updatedAt.toISOString(),
      size: formatBytes(asset.fileSize) || formatTextSize(asset.parsedText),
      textSize: formatTextSize(asset.parsedText),
      canView: true,
      canDownload: true,
    }))
    .sort((left, right) => new Date(right.updated).getTime() - new Date(left.updated).getTime());
}

export async function listReusableDocumentAssets(userId: string) {
  const assets = await listReusableDocumentAssetsSafe(userId);

  return assets.map((asset) => ({
    id: asset.id,
    kind: asset.kind,
    title: cleanTitle(asset.title || asset.fileName),
    fileName: asset.fileName,
    size: formatBytes(asset.fileSize),
    updated: asset.updatedAt.toISOString(),
  }));
}

export async function getUserDocumentAsset(userId: string, documentId: string) {
  let document;
  try {
    document = await prisma.documentAsset.findFirst({
      where: { id: documentId, userId },
    });
  } catch (error) {
    if (isMissingDocumentAssetTable(error)) {
      throw badRequest(
        "DocumentAsset table is missing.",
        "数据库还没完成资料中心迁移，请先执行 `npm run db:migrate` 或 `npx prisma migrate deploy`",
        "DOCUMENT_ASSET_TABLE_MISSING"
      );
    }
    throw error;
  }

  if (!document) {
    throw badRequest("Document not found.", "资料不存在或无权访问", "DOCUMENT_NOT_FOUND");
  }

  return document;
}

export async function renameUserDocumentAsset(userId: string, documentId: string, title: string) {
  const clean = title.trim();
  if (!clean) {
    throw badRequest("Document title is required.", "资料名称不能为空", "DOCUMENT_TITLE_REQUIRED");
  }

  await getUserDocumentAsset(userId, documentId);
  try {
    return await prisma.documentAsset.update({
      where: { id: documentId },
      data: { title: clean.slice(0, 120) },
    });
  } catch (error) {
    if (isMissingDocumentAssetTable(error)) {
      throw badRequest(
        "DocumentAsset table is missing.",
        "数据库还没完成资料中心迁移，请先执行 `npm run db:migrate` 或 `npx prisma migrate deploy`",
        "DOCUMENT_ASSET_TABLE_MISSING"
      );
    }
    throw error;
  }
}

export async function deleteUserDocumentAsset(userId: string, documentId: string) {
  await getUserDocumentAsset(userId, documentId);
  try {
    return await prisma.documentAsset.delete({
      where: { id: documentId },
    });
  } catch (error) {
    if (isMissingDocumentAssetTable(error)) {
      throw badRequest(
        "DocumentAsset table is missing.",
        "数据库还没完成资料中心迁移，请先执行 `npm run db:migrate` 或 `npx prisma migrate deploy`",
        "DOCUMENT_ASSET_TABLE_MISSING"
      );
    }
    throw error;
  }
}

async function listDocumentAssetsSafe(userId: string) {
  try {
    return await prisma.documentAsset.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        kind: true,
        title: true,
        fileName: true,
        mimeType: true,
        fileSize: true,
        parsedText: true,
        parseStatus: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    if (isMissingDocumentAssetTable(error)) {
      return [];
    }
    throw error;
  }
}

async function listReusableDocumentAssetsSafe(userId: string) {
  try {
    return await prisma.documentAsset.findMany({
      where: {
        userId,
        kind: { in: ["resume", "jd"] },
        parseStatus: "parsed",
        parsedText: { not: "" },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        kind: true,
        title: true,
        fileName: true,
        fileSize: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    if (isMissingDocumentAssetTable(error)) {
      return [];
    }
    throw error;
  }
}

function isMissingDocumentAssetTable(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "P2021" &&
      "meta" in error &&
      String((error as { meta?: { modelName?: string } }).meta?.modelName || "") === "DocumentAsset"
  );
}

function kindLabel(kind: string) {
  if (kind === "resume") return "简历";
  if (kind === "jd") return "JD";
  return "资料";
}

function cleanTitle(value: string) {
  return value
    .replace(/\?\?/g, "")
    .replace(/\b(deepseek|frontend|unicode|verify|restart|final|fix)-\d+\b/gi, "")
    .replace(/\bdeepseek-(final|fix|restart)?-?\d+\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/[-_ ]+$/g, "")
    .trim();
}

function formatTextSize(text: string) {
  const bytes = Buffer.byteLength(text || "", "utf8");
  return formatBytes(bytes) || "文本";
}

function formatBytes(bytes: number) {
  if (!bytes) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${bytes} B`;
}
