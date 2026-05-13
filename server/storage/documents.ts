import { createClient } from "@supabase/supabase-js";
import { badRequest } from "../apiErrors";
import { getDocumentsBucket, getSupabaseServiceRoleKey, getSupabaseUrl } from "../../src/lib/supabase/env";

const bucketCache = new Set<string>();

function getStorageClient() {
  const url = getSupabaseUrl();
  const serviceRoleKey = getRequiredServiceRoleKey();

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getDocumentBucketName() {
  return getDocumentsBucket();
}

export async function uploadDocumentObject(input: {
  storageKey: string;
  buffer: Buffer;
  mimeType: string;
}) {
  const supabase = getStorageClient();
  const bucket = getDocumentsBucket();
  await ensureBucket(supabase, bucket);

  const { error } = await supabase.storage.from(bucket).upload(input.storageKey, input.buffer, {
    contentType: input.mimeType,
    upsert: false,
  });

  if (error) {
    throw badRequest(error.message, "文件保存失败，请稍后重试", "DOCUMENT_STORAGE_UPLOAD_FAILED");
  }

  return { bucket, storageKey: input.storageKey };
}

export async function createDocumentDownloadUrl(bucket: string, storageKey: string) {
  const supabase = getStorageClient();
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(storageKey, 60);

  if (error || !data?.signedUrl) {
    throw badRequest(error?.message || "Unable to create download URL.", "文件下载链接生成失败，请稍后重试", "DOCUMENT_DOWNLOAD_FAILED");
  }

  return data.signedUrl;
}

export async function deleteDocumentObject(bucket: string, storageKey: string) {
  const supabase = getStorageClient();
  const { error } = await supabase.storage.from(bucket).remove([storageKey]);

  if (error) {
    throw badRequest(error.message, "文件删除失败，请稍后重试", "DOCUMENT_STORAGE_DELETE_FAILED");
  }
}

async function ensureBucket(supabase: ReturnType<typeof getStorageClient>, bucket: string) {
  if (bucketCache.has(bucket)) return;

  const { data } = await supabase.storage.getBucket(bucket);
  if (data) {
    bucketCache.add(bucket);
    return;
  }

  const { error } = await supabase.storage.createBucket(bucket, {
    public: false,
    fileSizeLimit: Number(process.env.MAX_UPLOAD_BYTES || 8 * 1024 * 1024),
    allowedMimeTypes: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ],
  });

  if (error && !error.message.toLowerCase().includes("already exists")) {
    throw badRequest(error.message, "资料存储空间初始化失败，请检查 Supabase Storage 配置", "DOCUMENT_BUCKET_FAILED");
  }

  bucketCache.add(bucket);
}

function getRequiredServiceRoleKey() {
  try {
    return getSupabaseServiceRoleKey();
  } catch (error) {
    throw badRequest(
      error instanceof Error ? error.message : "SUPABASE_SERVICE_ROLE_KEY is not set.",
      "服务端文档上传未配置完成，请在 `.env.local` 中补充 `SUPABASE_SERVICE_ROLE_KEY` 后重启开发服务器",
      "SUPABASE_SERVICE_ROLE_KEY_MISSING"
    );
  }
}
