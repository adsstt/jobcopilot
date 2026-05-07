import type { Prisma, Story } from "@prisma/client";
import { buildStoryExtractionPrompt } from "../ai/prompts";
import { generateJson } from "../ai/providers";
import { prisma } from "./client";

export interface StoryCard {
  id: string;
  title: string;
  background: string;
  task: string;
  action: string;
  result: string;
  relatedSkill: string;
  relatedJDKeywords: string[];
  confidenceScore: number;
  isHighFrequency: boolean;
  source: string;
  updatedAt: string;
}

interface GeneratedStory {
  title: string;
  background: string;
  task: string;
  action: string;
  result: string;
  relatedSkill: string;
  relatedJDKeywords: string[];
  confidenceScore: number;
  isHighFrequency: boolean;
  source: string;
}

export async function listStories(userId: string) {
  let stories = await prisma.story.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  if (!stories.length) {
    await generateStoriesFromUserData(userId);
    stories = await prisma.story.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  }

  return stories.map(toStoryCard);
}

export async function generateStoriesFromUserData(userId: string) {
  const source = await collectStorySource(userId);
  if (!hasUsefulSource(source)) return [];

  const fallbackStories = buildFallbackStories(source);
  const result = await generateJson<{ stories: GeneratedStory[] }>(
    buildStoryExtractionPrompt(source),
    { stories: fallbackStories }
  );

  const stories = normalizeGeneratedStories(result.stories, fallbackStories);
  if (!stories.length) return [];

  const existing = await prisma.story.findMany({
    where: { userId },
    select: { title: true },
  });
  const existingTitles = new Set(existing.map((story) => normalizeTitle(story.title)));
  const uniqueStories = stories.filter((story) => !existingTitles.has(normalizeTitle(story.title)));
  if (!uniqueStories.length) return [];

  const created = await prisma.$transaction(
    uniqueStories.map((story) =>
      prisma.story.create({
        data: toCreateInput(userId, story),
      })
    )
  );

  return created.map(toStoryCard);
}

export async function createStory(userId: string, input: Partial<StoryCard>) {
  const story = normalizeStoryInput(input);
  const created = await prisma.story.create({
    data: toCreateInput(userId, story),
  });

  return toStoryCard(created);
}

export async function updateStory(userId: string, id: string, input: Partial<StoryCard>) {
  const existing = await prisma.story.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Story not found.");

  const current = toStoryCard(existing);
  const merged = normalizeStoryInput({ ...current, ...input });
  const updated = await prisma.story.update({
    where: { id },
    data: toUpdateInput(merged),
  });

  return toStoryCard(updated);
}

async function collectStorySource(userId: string) {
  const [resumes, messages, reviews] = await Promise.all([
    prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { title: true, rawText: true },
    }),
    prisma.interviewMessage.findMany({
      where: { session: { userId } },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { role: true, content: true, evaluation: true },
    }),
    prisma.review.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { summary: true, strengths: true, improvements: true },
    }),
  ]);

  const improvedAnswers = [
    ...messages.flatMap((message) => extractMessageImprovedAnswer(message.evaluation)),
    ...reviews.flatMap((review) => extractReviewImprovedAnswers(review.improvements)),
  ];

  return {
    resumes: resumes.map((resume) => `【${resume.title}】\n${resume.rawText}`).join("\n\n").slice(0, 8000),
    interviewMessages: messages
      .slice()
      .reverse()
      .map((message) => `${message.role}: ${message.content}`)
      .join("\n")
      .slice(0, 10000),
    improvedAnswers: improvedAnswers.join("\n\n").slice(0, 8000),
    fullReviews: reviews.map((review) => JSON.stringify(review.improvements || review.summary)).join("\n\n").slice(0, 10000),
  };
}

function extractMessageImprovedAnswer(value: unknown) {
  if (!value || typeof value !== "object") return [];
  const rewritten = (value as any).rewrittenAnswer;
  return typeof rewritten === "string" && rewritten.trim() ? [rewritten.trim()] : [];
}

function extractReviewImprovedAnswers(value: unknown) {
  const fullReview = value && typeof value === "object" ? (value as any).fullReview : null;
  const examples = Array.isArray(fullReview?.improvedAnswerExamples) ? fullReview.improvedAnswerExamples : [];
  return examples
    .map((example: any) => [example.originalQuestion, example.originalAnswer, example.improvedAnswer, example.whyBetter].filter(Boolean).join("\n"))
    .filter(Boolean);
}

function hasUsefulSource(source: { resumes: string; interviewMessages: string; improvedAnswers: string; fullReviews: string }) {
  return Object.values(source).some((value) => value.trim().length > 30);
}

function buildFallbackStories(source: { improvedAnswers: string; resumes: string; interviewMessages: string }): GeneratedStory[] {
  const text = source.improvedAnswers || source.interviewMessages || source.resumes;
  if (!text.trim()) return [];

  return [
    {
      title: "待完善的项目经历",
      background: "材料中已出现相关经历，但背景信息仍需进一步补充。",
      task: "建议明确当时负责的目标、约束和个人职责。",
      action: text.slice(0, 240),
      result: "未体现，建议补充可验证的业务结果、效率提升或质量指标。",
      relatedSkill: "项目表达",
      relatedJDKeywords: ["项目深挖", "STAR", "量化结果"],
      confidenceScore: 55,
      isHighFrequency: true,
      source: "mixed",
    },
  ];
}

function normalizeGeneratedStories(stories: unknown, fallback: GeneratedStory[]) {
  const list = Array.isArray(stories) ? stories : fallback;
  return list.map((story) => normalizeStoryInput(story as Partial<StoryCard>)).filter((story) => story.title).slice(0, 5);
}

function normalizeStoryInput(input: Partial<StoryCard>): GeneratedStory {
  return {
    title: stringOrFallback(input.title, "未命名项目故事"),
    background: stringOrFallback(input.background, "未体现，建议补充项目背景。"),
    task: stringOrFallback(input.task, "未体现，建议补充个人任务。"),
    action: stringOrFallback(input.action, "未体现，建议补充具体行动。"),
    result: stringOrFallback(input.result, "未体现，建议补充量化结果。"),
    relatedSkill: stringOrFallback(input.relatedSkill, "项目表达"),
    relatedJDKeywords: Array.isArray(input.relatedJDKeywords) ? input.relatedJDKeywords.filter(Boolean).map(String).slice(0, 8) : [],
    confidenceScore: clampScore(input.confidenceScore),
    isHighFrequency: Boolean(input.isHighFrequency),
    source: stringOrFallback(input.source, "manual"),
  };
}

function toCreateInput(userId: string, story: GeneratedStory): Prisma.StoryCreateInput {
  return {
    user: { connect: { id: userId } },
    title: story.title,
    content: JSON.stringify({
      background: story.background,
      task: story.task,
      action: story.action,
      result: story.result,
    }),
    tags: buildTags(story) as unknown as Prisma.InputJsonValue,
    roleTracks: [story.relatedSkill] as unknown as Prisma.InputJsonValue,
  };
}

function toUpdateInput(story: GeneratedStory): Prisma.StoryUpdateInput {
  return {
    title: story.title,
    content: JSON.stringify({
      background: story.background,
      task: story.task,
      action: story.action,
      result: story.result,
    }),
    tags: buildTags(story) as unknown as Prisma.InputJsonValue,
    roleTracks: [story.relatedSkill] as unknown as Prisma.InputJsonValue,
  };
}

function buildTags(story: GeneratedStory) {
  return {
    relatedSkill: story.relatedSkill,
    relatedJDKeywords: story.relatedJDKeywords,
    confidenceScore: story.confidenceScore,
    isHighFrequency: story.isHighFrequency,
    source: story.source,
  };
}

function toStoryCard(story: Story): StoryCard {
  const content = parseJson(story.content);
  const tags = story.tags && typeof story.tags === "object" ? (story.tags as any) : {};
  const roleTracks = Array.isArray(story.roleTracks) ? story.roleTracks.map(String) : [];

  return {
    id: story.id,
    title: story.title,
    background: stringOrFallback(content.background, ""),
    task: stringOrFallback(content.task, ""),
    action: stringOrFallback(content.action, story.content),
    result: stringOrFallback(content.result, ""),
    relatedSkill: stringOrFallback(tags.relatedSkill, roleTracks[0], "项目表达"),
    relatedJDKeywords: Array.isArray(tags.relatedJDKeywords) ? tags.relatedJDKeywords.map(String) : [],
    confidenceScore: clampScore(tags.confidenceScore),
    isHighFrequency: Boolean(tags.isHighFrequency),
    source: stringOrFallback(tags.source, "manual"),
    updatedAt: story.updatedAt.toISOString(),
  };
}

function parseJson(value: string) {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function stringOrFallback(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function clampScore(value: unknown) {
  const score = Number(value);
  if (!Number.isFinite(score)) return 60;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeTitle(title: string) {
  return title.trim().toLowerCase().replace(/\s+/g, "");
}
