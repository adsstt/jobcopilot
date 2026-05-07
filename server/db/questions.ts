import { createHash } from "node:crypto";
import { buildQuestionGenerationPrompt } from "../ai/prompts";
import { generateJson } from "../ai/providers";
import { prisma } from "./client";

export interface QuestionItem {
  id: string;
  question: string;
  questionType: string;
  relatedSkill: string;
  source: string;
  difficulty: "基础" | "中等" | "困难";
  answerStrategy: string;
  relatedStoryId: string | null;
  askedCount: number;
  lastAskedAt: string | null;
}

interface CandidateQuestion {
  question: string;
  questionType?: string;
  relatedSkill?: string;
  source?: string;
  difficulty?: string;
  answerStrategy?: string;
  relatedStoryId?: string | null;
}

export async function listQuestions(userId: string, options: { forceGenerate?: boolean } = {}) {
  const derived = options.forceGenerate ? [] : await deriveQuestions(userId);
  if (derived.length) return derived;
  return generateQuestions(userId);
}

export async function generateQuestions(userId: string) {
  const source = await collectQuestionSource(userId);
  if (!hasSource(source)) return [];

  const fallback = buildFallbackQuestions(source);
  const result = await generateJson<{ questions: CandidateQuestion[] }>(
    buildQuestionGenerationPrompt(source),
    { questions: fallback }
  );

  return normalizeQuestions(result.questions, source.askedStats);
}

async function deriveQuestions(userId: string) {
  const [sessions, messages, reviews, stories] = await Promise.all([
    prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: { id: true, roleTrack: true, analysis: true, updatedAt: true },
    }),
    prisma.interviewMessage.findMany({
      where: { session: { userId }, role: "ai" },
      orderBy: { createdAt: "desc" },
      take: 80,
      select: { content: true, testedSkill: true, createdAt: true },
    }),
    prisma.review.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: { improvements: true, updatedAt: true },
    }),
    prisma.story.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 20,
      select: { id: true, title: true, tags: true, roleTracks: true },
    }),
  ]);

  const askedStats = buildAskedStats(messages);
  const candidates: CandidateQuestion[] = [];

  for (const session of sessions) {
    const analysis = session.analysis as any;
    const roleTrack = session.roleTrack || "岗位匹配";

    for (const item of asArray(analysis?.suggestedQuestions)) {
      candidates.push({
        question: stringOrFallback(item?.question),
        questionType: "项目深挖",
        relatedSkill: stringOrFallback(item?.targetGap, roleTrack),
        source: "analysis.suggestedQuestions",
        difficulty: priorityToDifficulty(item?.priority),
        answerStrategy: asArray(item?.expectedAnswerElements).length
          ? `回答中至少覆盖：${asArray(item.expectedAnswerElements).join("、")}`
          : "用 STAR 结构回答，补充个人职责、具体动作和量化结果。",
      });
    }

    for (const item of asArray(analysis?.interviewPreparation?.likelyQuestions)) {
      candidates.push({
        question: stringOrFallback(item?.question),
        questionType: stringOrFallback(item?.questionType, "能力验证"),
        relatedSkill: stringOrFallback(item?.whyAsked, roleTrack),
        source: "analysis.interviewPreparation",
        difficulty: "中等",
        answerStrategy: stringOrFallback(item?.answerStrategy, "先明确问题意图，再结合真实项目证据回答。"),
      });
    }
  }

  for (const message of messages) {
    const question = cleanQuestion(message.content);
    if (!question || !isUsableInterviewQuestion(question)) continue;
    candidates.push({
      question,
      questionType: inferQuestionType(question),
      relatedSkill: message.testedSkill || "历史追问",
      source: "interview.message",
      difficulty: "中等",
      answerStrategy: "这是历史面试中真实问过的问题，建议复盘当时回答并补齐 STAR 四段。",
    });
  }

  for (const review of reviews) {
    const fullReview = review.improvements && typeof review.improvements === "object" ? (review.improvements as any).fullReview : null;
    for (const focus of asArray(fullReview?.nextTrainingFocus)) {
      const skill = String(focus).trim();
      if (!skill) continue;
      candidates.push({
        question: `请结合一个真实项目，说明你如何体现「${skill}」？`,
        questionType: "能力验证",
        relatedSkill: skill,
        source: "review.nextTrainingFocus",
        difficulty: "中等",
        answerStrategy: "围绕复盘指出的训练重点，补充项目背景、个人动作和可验证结果。",
      });
    }
  }

  for (const story of stories) {
    const tags = story.tags && typeof story.tags === "object" ? (story.tags as any) : {};
    if (!tags.isHighFrequency) continue;
    const skill = stringOrFallback(tags.relatedSkill, asArray(story.roleTracks)[0], "高频故事");
    candidates.push({
      question: `请讲一个能体现「${skill}」的项目故事：当时背景是什么，你负责什么，采取了哪些行动，结果如何？`,
      questionType: "项目深挖",
      relatedSkill: skill,
      source: "story.highFrequency",
      difficulty: "中等",
      answerStrategy: "直接调用故事库素材，用 STAR 结构表达，并优先补充 JD 关键词和量化结果。",
      relatedStoryId: story.id,
    });
  }

  return normalizeQuestions(candidates, askedStats);
}

async function collectQuestionSource(userId: string) {
  const [sessions, messages, reviews, stories, resumes] = await Promise.all([
    prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 8,
      select: { resumeText: true, jdText: true, analysis: true },
    }),
    prisma.interviewMessage.findMany({
      where: { session: { userId } },
      orderBy: { createdAt: "desc" },
      take: 60,
      select: { role: true, content: true, createdAt: true },
    }),
    prisma.review.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 6,
      select: { summary: true, improvements: true },
    }),
    prisma.story.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 10,
      select: { id: true, title: true, content: true, tags: true },
    }),
    prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { rawText: true },
    }),
  ]);

  return {
    resumeText: [...resumes.map((resume) => resume.rawText), ...sessions.map((session) => session.resumeText)].join("\n\n").slice(0, 8000),
    jdText: sessions.map((session) => session.jdText).join("\n\n").slice(0, 8000),
    analysisText: sessions.map((session) => JSON.stringify(session.analysis || {})).join("\n\n").slice(0, 10000),
    reviewText: reviews.map((review) => JSON.stringify(review.improvements || review.summary)).join("\n\n").slice(0, 10000),
    storyText: stories.map((story) => JSON.stringify({ id: story.id, title: story.title, content: story.content, tags: story.tags })).join("\n\n").slice(0, 8000),
    askedStats: buildAskedStats(messages.filter((message) => message.role === "ai").map((message) => ({ content: message.content, createdAt: message.createdAt }))),
  };
}

function normalizeQuestions(candidates: CandidateQuestion[], askedStats: Map<string, { count: number; lastAskedAt: string | null }>): QuestionItem[] {
  const seen = new Set<string>();
  const items: QuestionItem[] = [];

  for (const candidate of candidates) {
    const question = cleanQuestion(candidate.question || "");
    if (!question) continue;
    const key = normalizeQuestion(question);
    if (seen.has(key)) continue;
    seen.add(key);

    const stats = askedStats.get(key);
    items.push({
      id: stableId(question),
      question,
      questionType: stringOrFallback(candidate.questionType, inferQuestionType(question)),
      relatedSkill: stringOrFallback(candidate.relatedSkill, "综合能力"),
      source: stringOrFallback(candidate.source, "derived"),
      difficulty: normalizeDifficulty(candidate.difficulty),
      answerStrategy: stringOrFallback(candidate.answerStrategy, "建议使用 STAR 结构回答，并补充个人职责、关键动作和量化结果。"),
      relatedStoryId: candidate.relatedStoryId || null,
      askedCount: stats?.count || 0,
      lastAskedAt: stats?.lastAskedAt || null,
    });
  }

  return items.sort((left, right) => scoreQuestion(right) - scoreQuestion(left)).slice(0, 80);
}

function buildAskedStats(messages: Array<{ content: string; createdAt: Date }>) {
  const stats = new Map<string, { count: number; lastAskedAt: string | null }>();
  for (const message of messages) {
    const question = cleanQuestion(message.content);
    if (!question || !isUsableInterviewQuestion(question)) continue;
    const key = normalizeQuestion(question);
    const existing = stats.get(key);
    stats.set(key, {
      count: (existing?.count || 0) + 1,
      lastAskedAt: existing?.lastAskedAt || message.createdAt.toISOString(),
    });
  }
  return stats;
}

function buildFallbackQuestions(source: { storyText: string; reviewText: string; analysisText: string }): CandidateQuestion[] {
  const basis = source.storyText || source.reviewText || source.analysisText;
  if (!basis.trim()) return [];
  return [
    {
      question: "请结合一个真实项目，说明你的个人角色、关键行动和最终结果。",
      questionType: "项目深挖",
      relatedSkill: "项目表达",
      source: "ai_generated",
      difficulty: "中等",
      answerStrategy: "用 STAR 结构回答，避免只讲团队做了什么，要突出个人贡献和结果指标。",
    },
  ];
}

function hasSource(source: { resumeText: string; jdText: string; analysisText: string; reviewText: string; storyText: string }) {
  return [source.resumeText, source.jdText, source.analysisText, source.reviewText, source.storyText].some((value) => value.trim().length > 30);
}

function asArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function cleanQuestion(value: string) {
  const text = stringOrFallback(value).replace(/\s+/g, " ").trim();
  if (!text) return "";
  return text.length > 260 ? `${text.slice(0, 257)}...` : text;
}

function isUsableInterviewQuestion(question: string) {
  const blockedPatterns = [
    "本次模拟面试到这里结束",
    "点击结束按钮进入复盘",
    "生成本次复盘",
    "正式面试环节先到这里",
    "正式问答已结束",
    "你还想再补充",
    "还是结束面试",
  ];
  if (blockedPatterns.some((pattern) => question.includes(pattern))) return false;

  return /[?？]$/.test(question) || /^(请|你|如果|能否|为什么|讲一个|说说|介绍一下|请结合)/.test(question);
}

function normalizeQuestion(question: string) {
  return question.toLowerCase().replace(/\s+/g, "").replace(/[？?。.!！]/g, "");
}

function stableId(question: string) {
  return `q_${createHash("sha1").update(question).digest("hex").slice(0, 16)}`;
}

function stringOrFallback(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function normalizeDifficulty(value: unknown): "基础" | "中等" | "困难" {
  if (value === "基础" || value === "中等" || value === "困难") return value;
  if (value === "高" || value === "困难") return "困难";
  if (value === "低" || value === "基础") return "基础";
  return "中等";
}

function priorityToDifficulty(value: unknown) {
  if (value === "高") return "困难";
  if (value === "低") return "基础";
  return "中等";
}

function inferQuestionType(question: string) {
  if (/为什么|动机|规划|稳定|离职/.test(question)) return "动机匹配";
  if (/技术|架构|系统|工具|实现|性能|接口/.test(question)) return "技术细节";
  if (/业务|指标|用户|增长|转化|目标/.test(question)) return "业务理解";
  if (/压力|失败|冲突|挑战|质疑/.test(question)) return "压力风险";
  if (/反问|面试官/.test(question)) return "反问能力";
  return "项目深挖";
}

function scoreQuestion(question: QuestionItem) {
  const sourceWeight: Record<string, number> = {
    "analysis.suggestedQuestions": 60,
    "analysis.interviewPreparation": 55,
    "story.highFrequency": 50,
    "review.nextTrainingFocus": 45,
    "interview.message": 40,
    ai_generated: 30,
  };
  return (sourceWeight[question.source] || 20) + question.askedCount * 5 + (question.difficulty === "困难" ? 8 : 0);
}
