import { readFile } from "node:fs/promises";
import type { IncomingMessage } from "node:http";
import formidable, { type File } from "formidable";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export interface ParsedUpload {
  fields: Record<string, string>;
  files: Record<string, ParsedFile>;
}

export interface ParsedFile {
  filename: string;
  mimetype: string;
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
  const mimetype = file.mimetype || guessMimeType(filename);
  const text = await extractText(buffer, mimetype, filename);

  return { filename, mimetype, text };
}

export async function parseFileBuffer(buffer: Buffer, mimetype: string, filename: string): Promise<ParsedFile> {
  return {
    filename,
    mimetype: mimetype || guessMimeType(filename),
    text: await extractText(buffer, mimetype || guessMimeType(filename), filename),
  };
}

async function extractText(buffer: Buffer, mimetype: string, filename: string) {
  if (mimetype.includes("pdf") || filename.toLowerCase().endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    try {
      const result = await parser.getText();
      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  if (
    mimetype.includes("wordprocessingml") ||
    filename.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  }

  if (mimetype.startsWith("text/") || filename.toLowerCase().endsWith(".txt")) {
    return buffer.toString("utf8").trim();
  }

  if (mimetype.startsWith("image/")) {
    return "[TODO: 图片 OCR 解析暂未实现。请先粘贴图片中的文字，后续可接入 PaddleOCR、阿里云 OCR 或模型视觉 API。]";
  }

  return "[TODO: 当前文件类型暂不支持自动解析。MVP 已支持 PDF、DOCX、TXT 和纯文本输入。]";
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
