import { NextRequest, NextResponse } from "next/server";
import { buildApiErrorResponse, createRequestId } from "../../../../server/apiErrors";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";
import { createSessionWithAnalysis } from "../../../../server/db/aiSessions";
import { parseFileBuffer } from "../../../../server/parsers/documentParser";
import { createAnalysis } from "../../../../server/services/analysis";

export const runtime = "nodejs";

const route = "/api/analysis";

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request);

  try {
    const contentType = request.headers.get("content-type") || "";
    const user = await getCurrentUser();

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const roleTrack = String(form.get("roleTrack") || "");
      const resumeText = String(form.get("resumeText") || "");
      const jdText = String(form.get("jdText") || "");
      const resumeFile = form.get("resume");
      const jdFile = form.get("jd");

      const parsedResume = resumeFile instanceof File ? await parseBrowserFile(resumeFile) : null;
      const parsedJd = jdFile instanceof File ? await parseBrowserFile(jdFile) : null;
      const mergedResumeText = [resumeText, parsedResume?.text].filter(Boolean).join("\n\n");
      const mergedJdText = [jdText, parsedJd?.text].filter(Boolean).join("\n\n");

      const result = await createAnalysis({
        roleTrack,
        resumeText: mergedResumeText,
        jdText: mergedJdText,
      });

      const session = await createSessionWithAnalysis({
        userId: user.id,
        roleTrack: result.roleTrack,
        resumeText,
        jdText: mergedJdText,
        resumeFile: parsedResume,
        analysis: result,
      });

      return NextResponse.json({ ...result, sessionId: session.id }, { headers: { "x-request-id": requestId } });
    }

    const body = await request.json().catch(() => ({}));
    const result = await createAnalysis(body);
    const session = await createSessionWithAnalysis({
      userId: user.id,
      roleTrack: result.roleTrack,
      resumeText: body.resumeText || "",
      jdText: body.jdText || "",
      analysis: result,
    });

    return NextResponse.json({ ...result, sessionId: session.id }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "AI 生成失败，请检查模型配置或稍后再试",
      errorCode: "ANALYSIS_FAILED",
      status: 500,
    });
  }
}

async function parseBrowserFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  return parseFileBuffer(Buffer.from(arrayBuffer), file.type, file.name);
}
