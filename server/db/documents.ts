import { prisma } from "./client";

export async function listUserDocuments(userId: string) {
  const [resumes, sessionsWithJd] = await Promise.all([
    prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        fileName: true,
        mimeType: true,
        rawText: true,
        updatedAt: true,
      },
    }),
    prisma.interviewSession.findMany({
      where: {
        userId,
        jdText: { not: "" },
      },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        roleTrack: true,
        jdText: true,
        status: true,
        analysis: true,
        updatedAt: true,
      },
    }),
  ]);

  return [
    ...resumes.map((resume) => ({
      id: resume.id,
      type: "简历",
      title: cleanTitle(resume.fileName || resume.title || "简历资料"),
      track: "默认",
      status: resume.mimeType ? "已上传" : "文本",
      updated: resume.updatedAt.toISOString(),
      size: formatTextSize(resume.rawText),
    })),
    ...sessionsWithJd.map((session) => ({
      id: session.id,
      type: "JD",
      title: buildJdTitle(session),
      track: cleanTitle(session.roleTrack || "岗位方向"),
      status: session.status === "analyzed" ? "已分析" : "已关联",
      updated: session.updatedAt.toISOString(),
      size: formatTextSize(session.jdText),
    })),
  ].sort((left, right) => new Date(right.updated).getTime() - new Date(left.updated).getTime());
}

function buildJdTitle(session: { roleTrack: string; title: string; analysis: unknown }) {
  const jdAnalysis = (session.analysis as any)?.jdAnalysis;
  const companyName = cleanTitle(jdAnalysis?.companyName || "");
  const jobTitle = cleanTitle(jdAnalysis?.jobTitle || "");

  if (jobTitle && companyName && companyName !== "未明确") return `${companyName} · ${jobTitle} JD`;
  if (jobTitle && jobTitle !== "未明确") return `${jobTitle} JD`;

  return `${cleanTitle(session.roleTrack || session.title || "目标岗位")} JD`;
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
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return bytes ? `${bytes} B` : "文本";
}
