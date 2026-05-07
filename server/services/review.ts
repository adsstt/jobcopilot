import type { Prisma } from "@prisma/client";
import { buildReviewPrompt } from "../ai/prompts";
import { generateJson } from "../ai/providers";
import { prisma } from "../db/client";
import type { InterviewTurn, MatchAnalysis } from "../types";

export interface FullReviewResult {
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  repeatedProblems: string[];
  answerQuality: {
    structure?: string;
    specificity?: string;
    evidence?: string;
    roleClarity?: string;
  };
  jdFitAnalysis: {
    matchedSignals?: string[];
    riskSignals?: string[];
    gapToAddress?: string[];
  };
  improvedAnswerExamples: Array<{
    originalQuestion: string;
    originalAnswer: string;
    improvedAnswer: string;
    whyBetter: string;
  }>;
  nextTrainingFocus: string[];
  actionPlan: Array<{
    task: string;
    reason: string;
    howToPractice: string;
  }>;
}

export async function generateSessionReview(userId: string, sessionId: string) {
  const session = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        select: { role: true, content: true },
      },
    },
  });

  if (!session) {
    throw new Error("Interview session not found.");
  }

  const history = session.messages
    .filter((message) => message.role === "ai" || message.role === "user")
    .map((message) => ({
      role: message.role as "ai" | "user",
      content: message.content,
    }));

  const fallback = buildFallbackReview(session.roleTrack, history);
  const result = await generateJson<FullReviewResult>(
    buildReviewPrompt({
      roleTrack: session.roleTrack,
      resumeText: session.resumeText,
      jdText: session.jdText,
      analysis: session.analysis as unknown as MatchAnalysis | null,
      history,
    }),
    fallback
  );
  const review = normalizeReviewResult(result, fallback);
  const rating = ratingFromScore(review.overallScore);

  await prisma.$transaction([
    prisma.interviewSession.update({
      where: { id: session.id },
      data: {
        status: "review_ready",
        overallScore: review.overallScore,
        overallRating: rating,
        reviewSummary: review.summary,
        completedAt: new Date(),
      },
    }),
    prisma.review.upsert({
      where: { sessionId: session.id },
      create: {
        userId,
        sessionId: session.id,
        title: `${session.roleTrack} 完整复盘`,
        summary: review.summary,
        score: review.overallScore,
        rating,
        strengths: review.strengths as unknown as Prisma.InputJsonValue,
        improvements: {
          fullReview: review,
          weaknesses: review.weaknesses,
          nextTrainingFocus: review.nextTrainingFocus,
          actionPlan: review.actionPlan,
        } as unknown as Prisma.InputJsonValue,
      },
      update: {
        title: `${session.roleTrack} 完整复盘`,
        summary: review.summary,
        score: review.overallScore,
        rating,
        strengths: review.strengths as unknown as Prisma.InputJsonValue,
        improvements: {
          fullReview: review,
          weaknesses: review.weaknesses,
          nextTrainingFocus: review.nextTrainingFocus,
          actionPlan: review.actionPlan,
        } as unknown as Prisma.InputJsonValue,
      },
    }),
  ]);

  return { ...review, rating };
}

function buildFallbackReview(roleTrack: string, history: InterviewTurn[]): FullReviewResult {
  const hasUserAnswers = history.some((turn) => turn.role === "user");

  return {
    overallScore: hasUserAnswers ? 80 : 70,
    summary: `本次 ${roleTrack} 模拟面试已完成。整体表达具备基础结构，但仍需要围绕岗位要求补充个人角色、具体动作和可验证结果。`,
    strengths: ["能够完成基础问答流程", "有一定项目表达意识"],
    weaknesses: ["量化结果体现不足", "个人角色和关键动作还可以更具体"],
    repeatedProblems: ["回答容易停留在概述层面，缺少指标、工具和结果验证"],
    answerQuality: {
      structure: "已有基本表达结构，但 STAR 四段还不够完整。",
      specificity: "具体场景和动作描述不足。",
      evidence: "数据、指标和结果证据体现不足。",
      roleClarity: "个人职责需要说得更清楚。",
    },
    jdFitAnalysis: {
      matchedSignals: ["具备与目标岗位相关的经验基础"],
      riskSignals: ["岗位核心要求与简历证据之间仍有部分 Gap"],
      gapToAddress: ["补充业务结果、岗位关键词和可验证成果"],
    },
    improvedAnswerExamples: [
      {
        originalQuestion: "请介绍一个代表性项目。",
        originalAnswer: "未体现完整原句",
        improvedAnswer: "我负责某项目中的关键模块，先明确业务目标和约束，再拆解方案并推动落地，最后用可验证指标复盘效果。具体数据建议根据真实经历补充。",
        whyBetter: "更清楚地交代了背景、个人角色、行动和结果。",
      },
    ],
    nextTrainingFocus: ["STAR 结构表达", "业务指标补充", "岗位关键词映射"],
    actionPlan: [
      {
        task: "整理 2 个高频项目故事",
        reason: "提高正式面试中的表达稳定性",
        howToPractice: "按背景、任务、行动、结果四段写出 2 分钟口述稿",
      },
      {
        task: "补充真实量化结果",
        reason: "增强回答可信度和岗位匹配度",
        howToPractice: "为每个项目补充至少 1 个效率、成本、转化或质量指标",
      },
    ],
  };
}

function normalizeReviewResult(result: Partial<FullReviewResult>, fallback: FullReviewResult): FullReviewResult {
  return {
    overallScore: Number.isFinite(Number(result.overallScore)) ? Number(result.overallScore) : fallback.overallScore,
    summary: stringOrFallback(result.summary, fallback.summary),
    strengths: arrayOrFallback(result.strengths, fallback.strengths).slice(0, 3),
    weaknesses: arrayOrFallback(result.weaknesses, fallback.weaknesses).slice(0, 3),
    repeatedProblems: arrayOrFallback(result.repeatedProblems, fallback.repeatedProblems),
    answerQuality: result.answerQuality && typeof result.answerQuality === "object" ? result.answerQuality : fallback.answerQuality,
    jdFitAnalysis: result.jdFitAnalysis && typeof result.jdFitAnalysis === "object" ? result.jdFitAnalysis : fallback.jdFitAnalysis,
    improvedAnswerExamples: Array.isArray(result.improvedAnswerExamples) && result.improvedAnswerExamples.length ? result.improvedAnswerExamples : fallback.improvedAnswerExamples,
    nextTrainingFocus: arrayOrFallback(result.nextTrainingFocus, fallback.nextTrainingFocus),
    actionPlan: Array.isArray(result.actionPlan) && result.actionPlan.length ? result.actionPlan : fallback.actionPlan,
  };
}

function stringOrFallback(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function arrayOrFallback(...values: unknown[]) {
  for (const value of values) {
    if (Array.isArray(value)) {
      const cleaned = value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim());
      if (cleaned.length) return cleaned;
    }
  }
  return [];
}

function ratingFromScore(score: number) {
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  return "C";
}
