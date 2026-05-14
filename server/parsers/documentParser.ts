import { readFile } from "node:fs/promises";
import type { IncomingMessage } from "node:http";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import formidable, { type File } from "formidable";
import mammoth from "mammoth";
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
    return extractPdfText(buffer);
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

async function extractPdfText(buffer: Buffer) {
  await ensurePdfDomPolyfills();

  const { PDFParse } = await import("pdf-parse");
  PDFParse.setWorker(getPdfWorkerSrc());

  const parser = new PDFParse({ data: buffer });
  try {
    const result = await parser.getText();
    return requireText(result.text);
  } finally {
    await parser.destroy();
  }
}

async function ensurePdfDomPolyfills() {
  const globalScope = globalThis as Record<string, unknown>;

  globalScope.DOMMatrix ??= SimpleDOMMatrix;
}

class SimpleDOMMatrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;

  constructor(init?: string | number[] | Float32Array | Float64Array) {
    const values = Array.isArray(init) || ArrayBuffer.isView(init) ? Array.from(init as ArrayLike<number>) : null;
    this.a = values?.[0] ?? 1;
    this.b = values?.[1] ?? 0;
    this.c = values?.[2] ?? 0;
    this.d = values?.[3] ?? 1;
    this.e = values?.[4] ?? 0;
    this.f = values?.[5] ?? 0;
  }

  static fromFloat32Array(array32: Float32Array) {
    return new SimpleDOMMatrix(array32);
  }

  static fromFloat64Array(array64: Float64Array) {
    return new SimpleDOMMatrix(array64);
  }

  static fromMatrix(other?: { a?: number; b?: number; c?: number; d?: number; e?: number; f?: number }) {
    return new SimpleDOMMatrix([other?.a ?? 1, other?.b ?? 0, other?.c ?? 0, other?.d ?? 1, other?.e ?? 0, other?.f ?? 0]);
  }

  translate(tx = 0, ty = 0) {
    return new SimpleDOMMatrix([this.a, this.b, this.c, this.d, this.e + tx, this.f + ty]);
  }

  scale(scaleX = 1, scaleY = scaleX) {
    return new SimpleDOMMatrix([this.a * scaleX, this.b * scaleX, this.c * scaleY, this.d * scaleY, this.e, this.f]);
  }

  multiplySelf(other: SimpleDOMMatrix) {
    const result = multiplyMatrices(this, other);
    Object.assign(this, result);
    return this;
  }

  preMultiplySelf(other: SimpleDOMMatrix) {
    const result = multiplyMatrices(other, this);
    Object.assign(this, result);
    return this;
  }

  invertSelf() {
    const determinant = this.a * this.d - this.b * this.c;
    if (!determinant) {
      this.a = this.b = this.c = this.d = this.e = this.f = NaN;
      return this;
    }

    const { a, b, c, d, e, f } = this;
    this.a = d / determinant;
    this.b = -b / determinant;
    this.c = -c / determinant;
    this.d = a / determinant;
    this.e = (c * f - d * e) / determinant;
    this.f = (b * e - a * f) / determinant;
    return this;
  }
}

function multiplyMatrices(left: SimpleDOMMatrix, right: SimpleDOMMatrix) {
  return {
    a: left.a * right.a + left.c * right.b,
    b: left.b * right.a + left.d * right.b,
    c: left.a * right.c + left.c * right.d,
    d: left.b * right.c + left.d * right.d,
    e: left.a * right.e + left.c * right.f + left.e,
    f: left.b * right.e + left.d * right.f + left.f,
  };
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
