import type { IncomingMessage } from "node:http";
import { parseMultipartUpload } from "./parsers/documentParser";
import { createAnalysis } from "./services/analysis";
import { createInterviewTurn } from "./services/interview";
import type { AnalysisRequest, InterviewMessageRequest } from "./types";

type RequestLike = IncomingMessage & { body?: unknown };

export async function readAnalysisInput(req: RequestLike): Promise<AnalysisRequest> {
  if (isMultipart(req)) {
    const upload = await parseMultipartUpload(req);
    return {
      roleTrack: upload.fields.roleTrack,
      resumeText: [upload.fields.resumeText, upload.files.resume?.text].filter(Boolean).join("\n\n"),
      jdText: [upload.fields.jdText, upload.files.jd?.text].filter(Boolean).join("\n\n"),
    };
  }

  return normalizeBody<AnalysisRequest>(req.body);
}

export async function handleAnalysis(input: AnalysisRequest) {
  return createAnalysis(input);
}

export async function handleInterviewMessage(input: InterviewMessageRequest) {
  return createInterviewTurn(input);
}

function normalizeBody<T>(body: unknown): T {
  if (!body) return {} as T;
  if (typeof body === "string") {
    return JSON.parse(body) as T;
  }
  return body as T;
}

function isMultipart(req: IncomingMessage) {
  const contentType = req.headers["content-type"] || "";
  return Array.isArray(contentType) ? contentType.some((value) => value.includes("multipart/form-data")) : contentType.includes("multipart/form-data");
}
