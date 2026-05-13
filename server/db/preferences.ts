import type { UserPreference } from "@prisma/client";
import { prisma } from "./client";

export const interviewStyles = ["friendly", "logic", "challenge"] as const;
export const interviewLanguages = ["zh-CN", "en-US", "mixed"] as const;

export type InterviewStyle = (typeof interviewStyles)[number];
export type InterviewLanguage = (typeof interviewLanguages)[number];

export interface SafeUserPreferences {
  interviewStyle: InterviewStyle;
  interviewLanguage: InterviewLanguage;
  pressureMode: boolean;
  notificationsEnabled: boolean;
  reminderEnabled: boolean;
  weeklyReviewEnabled: boolean;
  updatedAt: string;
}

export interface SaveUserPreferencesInput {
  interviewStyle?: string;
  interviewLanguage?: string;
  pressureMode?: boolean;
  notificationsEnabled?: boolean;
  reminderEnabled?: boolean;
  weeklyReviewEnabled?: boolean;
}

const defaults: Omit<SafeUserPreferences, "updatedAt"> = {
  interviewStyle: "friendly",
  interviewLanguage: "zh-CN",
  pressureMode: false,
  notificationsEnabled: true,
  reminderEnabled: true,
  weeklyReviewEnabled: false,
};

export async function getUserPreferences(userId: string): Promise<SafeUserPreferences> {
  const preference = await prisma.userPreference.upsert({
    where: { userId },
    create: { userId, ...defaults },
    update: {},
  });

  return toSafePreferences(preference);
}

export async function saveUserPreferences(userId: string, input: SaveUserPreferencesInput): Promise<SafeUserPreferences> {
  const preference = await prisma.userPreference.upsert({
    where: { userId },
    create: {
      userId,
      interviewStyle: normalizeInterviewStyle(input.interviewStyle),
      interviewLanguage: normalizeInterviewLanguage(input.interviewLanguage),
      pressureMode: toBoolean(input.pressureMode, defaults.pressureMode),
      notificationsEnabled: toBoolean(input.notificationsEnabled, defaults.notificationsEnabled),
      reminderEnabled: toBoolean(input.reminderEnabled, defaults.reminderEnabled),
      weeklyReviewEnabled: toBoolean(input.weeklyReviewEnabled, defaults.weeklyReviewEnabled),
    },
    update: {
      interviewStyle: normalizeInterviewStyle(input.interviewStyle),
      interviewLanguage: normalizeInterviewLanguage(input.interviewLanguage),
      pressureMode: toBoolean(input.pressureMode, defaults.pressureMode),
      notificationsEnabled: toBoolean(input.notificationsEnabled, defaults.notificationsEnabled),
      reminderEnabled: toBoolean(input.reminderEnabled, defaults.reminderEnabled),
      weeklyReviewEnabled: toBoolean(input.weeklyReviewEnabled, defaults.weeklyReviewEnabled),
    },
  });

  return toSafePreferences(preference);
}

export function normalizeInterviewStyle(value: unknown): InterviewStyle {
  return interviewStyles.includes(value as InterviewStyle) ? (value as InterviewStyle) : defaults.interviewStyle;
}

export function normalizeInterviewLanguage(value: unknown): InterviewLanguage {
  return interviewLanguages.includes(value as InterviewLanguage) ? (value as InterviewLanguage) : defaults.interviewLanguage;
}

export function getInterviewStyleInstruction(style: InterviewStyle) {
  if (style === "logic") return "大厂逻辑流：直击问题、追问框架、要求候选人说明取舍和证据，但保持专业克制。";
  if (style === "challenge") return "毒舌质疑流：更尖锐地指出漏洞和矛盾，增加反问与压力感，但不得羞辱候选人。";
  return "外企温和流：礼貌、鼓励、结构化反馈，在追问时保持支持性和清晰边界。";
}

export function getInterviewLanguageInstruction(language: InterviewLanguage) {
  if (language === "en-US") return "全程使用英文输出，并优先按英语面试表达习惯组织问题与反馈。";
  if (language === "mixed") return "使用中文为主，保留岗位、技术、业务术语的英文表达，适合中英混合职场语境。";
  return "全程使用中文普通话表达。";
}

export function toOpenAiTranscriptionLanguage(language: InterviewLanguage) {
  if (language === "en-US") return "en";
  if (language === "zh-CN") return "zh";
  return "";
}

function toSafePreferences(preference: UserPreference): SafeUserPreferences {
  return {
    interviewStyle: normalizeInterviewStyle(preference.interviewStyle),
    interviewLanguage: normalizeInterviewLanguage(preference.interviewLanguage),
    pressureMode: preference.pressureMode,
    notificationsEnabled: preference.notificationsEnabled,
    reminderEnabled: preference.reminderEnabled,
    weeklyReviewEnabled: preference.weeklyReviewEnabled,
    updatedAt: preference.updatedAt.toISOString(),
  };
}

function toBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}
