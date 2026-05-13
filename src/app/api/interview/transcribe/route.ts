import { NextResponse } from "next/server";
import { badRequest, buildApiErrorResponse, createRequestId } from "../../../../../server/apiErrors";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { getUserPreferences, toOpenAiTranscriptionLanguage } from "../../../../../server/db/preferences";
import { isSupportedAudioMimeType, transcribeInterviewAudio } from "../../../../../server/services/transcription";

export const runtime = "nodejs";

const route = "/api/interview/transcribe";

export async function POST(request: Request) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const preferences = await getUserPreferences(user.id);
    const form = await request.formData();
    const audio = form.get("audio");
    const durationMs = Number(form.get("durationMs") || 0);

    if (!(audio instanceof File)) {
      throw badRequest("Missing audio file.", "请先录制一段语音回答", "AUDIO_FILE_REQUIRED");
    }

    if (!isSupportedAudioMimeType(audio.type, audio.name)) {
      throw badRequest("Unsupported audio type.", "当前音频格式不支持，请使用浏览器录音后重试", "AUDIO_TYPE_UNSUPPORTED");
    }

    const maxBytes = Number(process.env.ASR_MAX_AUDIO_BYTES || 25 * 1024 * 1024);
    if (audio.size > maxBytes) {
      throw badRequest("Audio file too large.", `录音文件不能超过 ${Math.ceil(maxBytes / 1024 / 1024)} MB`, "AUDIO_FILE_TOO_LARGE");
    }

    const buffer = Buffer.from(await audio.arrayBuffer());
    const result = await transcribeInterviewAudio({
      buffer,
      filename: audio.name || "answer.webm",
      mimeType: audio.type || "audio/webm",
      language: toOpenAiTranscriptionLanguage(preferences.interviewLanguage),
    });

    return NextResponse.json(
      {
        transcription: {
          text: result.text,
          durationMs: Number.isFinite(durationMs) ? durationMs : 0,
          audioSize: audio.size,
          mimeType: audio.type,
          model: result.model,
        },
      },
      { headers: { "x-request-id": requestId } }
    );
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "语音识别失败，请稍后重试或改用文字输入",
      errorCode: "INTERVIEW_TRANSCRIBE_FAILED",
      status: 500,
    });
  }
}
