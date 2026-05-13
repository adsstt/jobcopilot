import type { Prisma } from "@prisma/client";
import type { InterviewMessageResponse, InterviewTurn, MatchAnalysis } from "../types";
import { prisma } from "./client";

export interface CreateSessionInput {
  userId: string;
  roleTrack: string;
  resumeText: string;
  jdText: string;
  analysis: MatchAnalysis;
  resumeFile?: {
    filename: string;
    mimetype: string;
    text?: string;
  } | null;
}

export interface StartSessionInput {
  userId: string;
  sessionId?: string;
  roleTrack: string;
  resumeText: string;
  jdText: string;
  analysis?: MatchAnalysis | null;
  nextQuestion: string;
  testedSkill: string;
  evaluation: InterviewMessageResponse["evaluation"];
}

export interface SaveAnswerInput extends StartSessionInput {
  answer: string;
}

export async function createSessionWithAnalysis(input: CreateSessionInput) {
  const resumeText = input.resumeText.trim() || input.resumeFile?.text || "";

  return prisma.$transaction(async (tx) => {
    const resume =
      resumeText.trim().length > 0
        ? await tx.resume.create({
            data: {
              userId: input.userId,
              title: input.resumeFile?.filename || `${input.roleTrack} 简历资料`,
              rawText: resumeText,
              fileName: input.resumeFile?.filename,
              mimeType: input.resumeFile?.mimetype,
            },
          })
        : null;

    return tx.interviewSession.create({
      data: {
        userId: input.userId,
        resumeId: resume?.id,
        roleTrack: input.roleTrack,
        title: `${input.roleTrack} 模拟面试`,
        status: "analyzed",
        resumeText,
        jdText: input.jdText,
        analysis: input.analysis as unknown as Prisma.InputJsonValue,
        matchScore: input.analysis.matchScore,
        reviewSummary: input.analysis.summary,
      },
      select: {
        id: true,
        roleTrack: true,
        matchScore: true,
        createdAt: true,
      },
    });
  });
}

export async function saveInitialAiQuestion(input: StartSessionInput) {
  const session = await getOrCreateSession(input);

  const existingAiMessage = await prisma.interviewMessage.findFirst({
    where: { sessionId: session.id, role: "ai" },
    orderBy: { createdAt: "asc" },
  });

  if (existingAiMessage) {
    return { sessionId: session.id };
  }

  await prisma.$transaction([
    prisma.interviewMessage.create({
      data: {
        sessionId: session.id,
        role: "ai",
        content: input.nextQuestion,
        testedSkill: input.testedSkill,
        evaluation: input.evaluation as unknown as Prisma.InputJsonValue,
        score: input.evaluation.score || null,
      },
    }),
    prisma.interviewSession.update({
      where: { id: session.id },
      data: {
        status: "interviewing",
        lastTestedSkill: input.testedSkill,
        reviewSummary: input.evaluation.summary,
      },
    }),
  ]);

  return { sessionId: session.id };
}

export async function saveAnswerAndAiResponse(input: SaveAnswerInput) {
  const session = await getOrCreateSession(input);

  await prisma.$transaction(async (tx) => {
    await tx.interviewMessage.create({
      data: {
        sessionId: session.id,
        role: "user",
        content: input.answer,
      },
    });

    await tx.interviewMessage.create({
      data: {
        sessionId: session.id,
        role: "ai",
        content: input.nextQuestion,
        testedSkill: input.testedSkill,
        evaluation: input.evaluation as unknown as Prisma.InputJsonValue,
        score: input.evaluation.score || null,
      },
    });

    await tx.interviewSession.update({
      where: { id: session.id },
      data: {
        status: "review_ready",
        overallScore: input.evaluation.score || null,
        overallRating: ratingFromScore(input.evaluation.score),
        reviewSummary: input.evaluation.summary,
        lastTestedSkill: input.testedSkill,
      },
    });

    await tx.review.upsert({
      where: { sessionId: session.id },
      create: {
        userId: input.userId,
        sessionId: session.id,
        title: `${session.roleTrack} 模拟复盘`,
        summary: input.evaluation.summary,
        score: input.evaluation.score || null,
        rating: ratingFromScore(input.evaluation.score),
        strengths: input.evaluation.strengths as unknown as Prisma.InputJsonValue,
        improvements: input.evaluation.improvements as unknown as Prisma.InputJsonValue,
      },
      update: {
        summary: input.evaluation.summary,
        score: input.evaluation.score || null,
        rating: ratingFromScore(input.evaluation.score),
        strengths: input.evaluation.strengths as unknown as Prisma.InputJsonValue,
        improvements: input.evaluation.improvements as unknown as Prisma.InputJsonValue,
      },
    });
  });

  return { sessionId: session.id };
}

export async function getSessionTurns(userId: string, sessionId: string): Promise<InterviewTurn[]> {
  const messages = await prisma.interviewMessage.findMany({
    where: {
      session: { id: sessionId, userId },
    },
    orderBy: { createdAt: "asc" },
    select: { role: true, content: true },
  });

  return messages
    .filter((message) => message.role === "ai" || message.role === "user")
    .map((message) => ({
      role: message.role as "ai" | "user",
      content: message.content,
    }));
}

export async function listInterviewReviews(userId: string) {
  const sessions = await prisma.interviewSession.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 20,
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { evaluation: true, testedSkill: true, createdAt: true },
      },
      review: true,
    },
  });

  return sessions.map((session) => ({
    ...extractReviewHighlights(session.review?.improvements),
    ...extractReviewSample(session.review?.improvements),
    id: session.id,
    title: session.review?.title || `${session.roleTrack} 模拟面试`,
    roleTrack: session.roleTrack,
    date: session.updatedAt.toISOString(),
    score: session.review?.score ?? session.overallScore ?? session.matchScore ?? 0,
    rating: session.review?.rating || session.overallRating || ratingFromScore(session.overallScore || session.matchScore || 0),
    focus: session.review?.summary || session.reviewSummary || "已完成分析，等待继续模拟面试。",
    tags: [
      session.roleTrack,
      extractReviewHighlights(session.review?.improvements).nextTrainingFocus?.[0] || session.lastTestedSkill || session.messages[0]?.testedSkill || "人岗匹配分析",
      session.status === "review_ready" ? "已生成复盘" : "已保存进度",
    ],
    matchScore: session.matchScore,
    status: session.status,
  }));
}

export async function getInterviewSessionAnalysis(userId: string, sessionId: string) {
  const session = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId },
    select: {
      id: true,
      roleTrack: true,
      title: true,
      resumeText: true,
      jdText: true,
      analysis: true,
      messages: {
        orderBy: { createdAt: "asc" },
        select: {
          role: true,
          content: true,
        },
      },
      matchScore: true,
      createdAt: true,
      updatedAt: true,
      reviewSummary: true,
      status: true,
    },
  });

  if (!session) return null;

  return {
    ...session,
    analysis: session.analysis as unknown as MatchAnalysis | null,
    messages: session.messages
      .filter((message) => message.role === "ai" || message.role === "user")
      .map((message) => ({
        role: message.role as "ai" | "user",
        content: message.content,
      })),
  };
}

function extractReviewHighlights(value: unknown) {
  if (!value || typeof value !== "object") return {};
  const fullReview = (value as any).fullReview;
  if (!fullReview || typeof fullReview !== "object") return {};
  return {
    weaknesses: Array.isArray(fullReview.weaknesses) ? fullReview.weaknesses : [],
    nextTrainingFocus: Array.isArray(fullReview.nextTrainingFocus) ? fullReview.nextTrainingFocus : [],
  };
}

function extractReviewSample(value: unknown) {
  if (!value || typeof value !== "object") return {};
  const fullReview = (value as any).fullReview;
  if (!fullReview || typeof fullReview !== "object") return {};

  const first = Array.isArray(fullReview.improvedAnswerExamples) ? fullReview.improvedAnswerExamples[0] : null;
  if (!first || typeof first !== "object") return {};

  return {
    sampleOriginalQuestion: typeof first.originalQuestion === "string" ? first.originalQuestion : null,
    sampleOriginalAnswer: typeof first.originalAnswer === "string" ? first.originalAnswer : null,
    sampleImprovedAnswer: typeof first.improvedAnswer === "string" ? first.improvedAnswer : null,
    sampleWhyBetter: typeof first.whyBetter === "string" ? first.whyBetter : null,
  };
}

async function getOrCreateSession(input: StartSessionInput) {
  if (input.sessionId) {
    const session = await prisma.interviewSession.findFirst({
      where: { id: input.sessionId, userId: input.userId },
      select: { id: true, roleTrack: true },
    });
    if (session) return session;
  }

  const created = await createSessionWithAnalysis({
    userId: input.userId,
    roleTrack: input.roleTrack,
    resumeText: input.resumeText,
    jdText: input.jdText,
    analysis: input.analysis || fallbackAnalysis(input.roleTrack),
  });

  return { id: created.id, roleTrack: created.roleTrack };
}

function fallbackAnalysis(roleTrack: string): MatchAnalysis {
  return {
    matchScore: 75,
    roleTrack,
    summary: "基础模拟面试模式。",
    strengths: [],
    weaknesses: [],
    predictedQuestions: [],
    trainingPlan: [],
  };
}

function ratingFromScore(score?: number | null) {
  if (!score) return null;
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  return "C";
}
