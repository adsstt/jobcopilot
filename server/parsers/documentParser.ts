import { readFile } from "node:fs/promises";
import type { IncomingMessage } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import formidable, { type File } from "formidable";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { badRequest } from "../apiErrors";

export interface ParsedUpload {
  fields: Record<string, string>;
  files: Record<string, ParsedFile>;
}

export interface ParsedFile {
  filename: string;
  mimetype: string;
  size: number;
  text: string;
}

export async function parseMultipartUpload(req: IncomingMessage): Promise<ParsedUpload> {
  const form = formidable({
    multiples: false,
    maxFileSize: Number(process.env.MAX_UPLOAD_BYTES || 8 * 1024 * 1024),
  });

  const [rawFields, rawFiles] = await form.parse(req);
  const fields = Object.fromEntries(
    Object.entries(rawFields).map(([key, value]) => [key, Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "")])
  );

  const files: Record<string, ParsedFile> = {};

  for (const [key, value] of Object.entries(rawFiles)) {
    const file = Array.isArray(value) ? value[0] : value;
    if (!file) continue;
    files[key] = await parseFile(file);
  }

  return { fields, files };
}

export async function parseFile(file: File): Promise<ParsedFile> {
  const buffer = await readFile(file.filepath);
  const filename = file.originalFilename || "upload";
  const mimetype = normalizeMimeType(file.mimetype || guessMimeType(filename), filename);
  const text = await extractText(buffer, mimetype, filename);

  return { filename, mimetype, size: buffer.byteLength, text };
}

export async function parseFileBuffer(buffer: Buffer, mimetype: string, filename: string): Promise<ParsedFile> {
  const normalizedMimeType = normalizeMimeType(mimetype || guessMimeType(filename), filename);
  return {
    filename,
    mimetype: normalizedMimeType,
    size: buffer.byteLength,
    text: await extractText(buffer, normalizedMimeType, filename),
  };
}

async function extractText(buffer: Buffer, mimetype: string, filename: string) {
  assertSupportedDocument(mimetype, filename);

  if (mimetype.includes("pdf") || filename.toLowerCase().endsWith(".pdf")) {
    PDFParse.setWorker(getPdfWorkerSrc());
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return requireText(result.text);
    } finally {
      await parser.destroy();
    }
  }

  if (
    mimetype.includes("wordprocessingml") ||
    filename.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return requireText(result.value);
  }

  if (mimetype.startsWith("text/") || filename.toLowerCase().endsWith(".txt")) {
    return requireText(buffer.toString("utf8"));
  }

  throw badRequest("Unsupported document type.", "当前仅支持 PDF、DOCX、TXT 文件", "UNSUPPORTED_DOCUMENT_TYPE");
}

export function assertSupportedDocument(mimetype: string, filename: string) {
  const lower = filename.toLowerCase();
  const normalized = normalizeMimeType(mimetype, filename);

  if (normalized.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|heic)$/i.test(lower)) {
    throw badRequest("Image OCR is not supported.", "当前暂不支持图片 OCR，请粘贴文本或上传 PDF/DOCX/TXT", "IMAGE_OCR_NOT_SUPPORTED");
  }

  const supported =
    normalized.includes("pdf") ||
    normalized.includes("wordprocessingml") ||
    normalized.startsWith("text/") ||
    lower.endsWith(".pdf") ||
    lower.endsWith(".docx") ||
    lower.endsWith(".txt");

  if (!supported) {
    throw badRequest("Unsupported document type.", "当前仅支持 PDF、DOCX、TXT 文件", "UNSUPPORTED_DOCUMENT_TYPE");
  }
}

function requireText(value: string) {
  const text = value.trim();
  if (!text) {
    throw badRequest("No text extracted from document.", "未能从文件中解析出文本，请粘贴文本或上传包含可复制文字的 PDF/DOCX/TXT", "DOCUMENT_TEXT_EMPTY");
  }
  return text;
}

function normalizeMimeType(mimetype: string, filename: string) {
  if (!mimetype || mimetype === "application/octet-stream") return guessMimeType(filename);
  return mimetype;
}

function guessMimeType(filename: string) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (lower.endsWith(".txt")) return "text/plain";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

function getPdfWorkerSrc() {
  return pathToFileURL(resolve(process.cwd(), "node_modules/pdf-parse/dist/pdf-parse/esm/pdf.worker.mjs")).href;
}
