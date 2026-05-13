import { badRequest } from "../apiErrors";

export interface TranscriptionInput {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  language?: string;
}

export interface TranscriptionResult {
  text: string;
  model: string;
}

export async function transcribeInterviewAudio(input: TranscriptionInput): Promise<TranscriptionResult> {
  const provider = (process.env.ASR_PROVIDER || "openai").toLowerCase();
  if (provider !== "openai") {
    throw badRequest("Unsupported ASR provider.", "当前仅支持 OpenAI 语音识别配置", "ASR_PROVIDER_UNSUPPORTED");
  }

  const apiKey = process.env.ASR_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw badRequest("ASR API key is missing.", "语音识别未配置 ASR_API_KEY", "ASR_API_KEY_MISSING");
  }

  const model = process.env.ASR_MODEL || "gpt-4o-mini-transcribe";
  const form = new FormData();
  const blob = new Blob([input.buffer], { type: normalizeAudioMimeType(input.mimeType) });

  form.set("file", blob, normalizeAudioFileName(input.filename, input.mimeType));
  form.set("model", model);
  form.set("response_format", "json");
  if (input.language) form.set("language", input.language);
  form.set("prompt", "这是一段中文或中英混合的模拟面试回答，请保留技术名词、公司名、岗位名和数字指标。");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw badRequest(`ASR request failed: ${response.status} ${text.slice(0, 500)}`, "语音识别失败，请稍后重试或改用文字输入", "ASR_REQUEST_FAILED");
  }

  const data = await response.json();
  const transcript = typeof data?.text === "string" ? data.text.trim() : "";
  if (!transcript) {
    throw badRequest("ASR returned empty text.", "未识别到有效语音，请靠近麦克风重试或改用文字输入", "ASR_EMPTY_TEXT");
  }

  return { text: transcript, model };
}

export function isSupportedAudioMimeType(mimeType: string, filename: string) {
  const lower = filename.toLowerCase();
  return (
    mimeType.startsWith("audio/") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".mp3") ||
    lower.endsWith(".mp4") ||
    lower.endsWith(".mpeg") ||
    lower.endsWith(".mpga") ||
    lower.endsWith(".m4a") ||
    lower.endsWith(".wav")
  );
}

function normalizeAudioMimeType(mimeType: string) {
  if (!mimeType) return "audio/webm";
  return mimeType.split(";")[0] || "audio/webm";
}

function normalizeAudioFileName(filename: string, mimeType: string) {
  const clean = filename.replace(/[\\/:*?"<>|]/g, "_").trim();
  if (/\.(webm|mp3|mp4|mpeg|mpga|m4a|wav)$/i.test(clean)) return clean;
  const type = normalizeAudioMimeType(mimeType);
  if (type.includes("mp4")) return `${clean || "answer"}.mp4`;
  if (type.includes("mpeg")) return `${clean || "answer"}.mp3`;
  if (type.includes("wav")) return `${clean || "answer"}.wav`;
  return `${clean || "answer"}.webm`;
}
