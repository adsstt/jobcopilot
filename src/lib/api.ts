import { normalizeResponseError } from "./appErrors";
import { createClient as createSupabaseClient } from "./supabase/client";

export type InterviewType = "HR面" | "业务面" | "技术面" | "终面";

export interface MatchAnalysis {
  sessionId?: string;
  matchScore: number;
  matchLevel?: string;
  coreSummary?: string;
  roleTrack: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  predictedQuestions: string[];
  trainingPlan: Array<{ title: string; reason: string }>;
  candidateProfile?: unknown;
  jdAnalysis?: unknown;
  capabilityAnalysis?: unknown;
  cvOptimization?: unknown;
  interviewPreparation?: unknown;
  suggestedQuestions?: unknown;
  preparationAdvice?: unknown;
}

export interface InterviewTurn {
  role: "ai" | "user";
  content: string;
}

export interface InterviewMessageResponse {
  sessionId?: string;
  currentStage?: "opening" | "formal" | "closing" | "review";
  shouldMoveToNextStage?: boolean;
  interviewType?: InterviewType;
  feedback?: string;
  improvement?: string;
  improvedAnswer?: string;
  followUpReason?: string;
  isClosing?: boolean;
  evaluation: {
    score: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    rewrittenAnswer: string;
  };
  nextQuestion: string;
  testedSkill: string;
}

export interface AnalysisInput {
  roleTrack: string;
  resumeText: string;
  jdText: string;
  resumeFile?: File | null;
  jdFile?: File | null;
  resumeDocumentId?: string;
  jdDocumentId?: string;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw normalizeResponseError(data?.error, `Request failed with ${response.status}`);
  }
  return data as T;
}

async function authFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const headers = new Headers(init.headers);

  if (typeof window !== "undefined") {
    try {
      const supabase = createSupabaseClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        headers.set("Authorization", `Bearer ${session.access_token}`);
      }
    } catch {
      // Fall back to cookie-based auth.
    }
  }

  return fetch(input, {
    ...init,
    credentials: "include",
    headers,
  });
}

export async function requestAnalysis(input: AnalysisInput) {
  if (input.resumeFile || input.jdFile) {
    const form = new FormData();
    form.set("roleTrack", input.roleTrack);
    form.set("resumeText", input.resumeText);
    form.set("jdText", input.jdText);
    if (input.resumeDocumentId) form.set("resumeDocumentId", input.resumeDocumentId);
    if (input.jdDocumentId) form.set("jdDocumentId", input.jdDocumentId);
    if (input.resumeFile) form.set("resume", input.resumeFile);
    if (input.jdFile) form.set("jd", input.jdFile);

    return parseResponse<MatchAnalysis>(
      await authFetch("/api/analysis", {
        method: "POST",
        body: form,
      })
    );
  }

  return parseResponse<MatchAnalysis>(
    await authFetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roleTrack: input.roleTrack,
        resumeText: input.resumeText,
        jdText: input.jdText,
        resumeDocumentId: input.resumeDocumentId,
        jdDocumentId: input.jdDocumentId,
      }),
    })
  );
}

export async function requestInterviewMessage(input: {
  sessionId?: string;
  interviewType?: InterviewType;
  roleTrack: string;
  resumeText: string;
  jdText: string;
  analysis?: MatchAnalysis | null;
  history: InterviewTurn[];
  answer?: string;
}) {
  return parseResponse<InterviewMessageResponse>(
    await authFetch("/api/interview/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}

export async function requestInterviewMessageStream(
  input: {
    sessionId?: string;
    interviewType?: InterviewType;
    roleTrack: string;
    resumeText: string;
    jdText: string;
    analysis?: MatchAnalysis | null;
    history: InterviewTurn[];
    answer?: string;
  },
  handlers: {
    onDelta: (text: string) => void;
    onDone: (result: InterviewMessageResponse) => void;
    onError?: (error: string) => void;
  }
) {
  const response = await authFetch("/api/interview/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...input, stream: true }),
  });

  if (!response.ok || !response.body) {
    const data = await response.json().catch(() => ({}));
    throw normalizeResponseError(data?.error, `Stream request failed with ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (!line.trim()) continue;
      const event = JSON.parse(line);

      if (event.type === "delta" && typeof event.text === "string") {
        handlers.onDelta(event.text);
      }

      if (event.type === "done") {
        handlers.onDone(event.result);
      }

      if (event.type === "error") {
        const normalized = normalizeResponseError(event.error, "AI 生成失败，请检查模型配置或稍后再试");
        handlers.onError?.(normalized.safeMessage);
        throw normalized;
      }
    }
  }

  if (buffer.trim()) {
    const event = JSON.parse(buffer);
    if (event.type === "error") {
      throw normalizeResponseError(event.error, "AI 生成失败，请检查模型配置或稍后再试");
    }
  }
}

export interface TranscriptionResult {
  text: string;
  durationMs: number;
  audioSize: number;
  mimeType: string;
  model: string;
}

export async function transcribeInterviewAudio(input: { audio: Blob; durationMs: number; fileName?: string }) {
  const form = new FormData();
  form.set("audio", input.audio, input.fileName || "answer.webm");
  form.set("durationMs", String(input.durationMs));

  return parseResponse<{ transcription: TranscriptionResult }>(
    await authFetch("/api/interview/transcribe", {
      method: "POST",
      body: form,
    })
  );
}

export interface InterviewReviewSummary {
  id: string;
  title: string;
  roleTrack: string;
  date: string;
  score: number;
  rating: string | null;
  focus: string;
  tags: string[];
  matchScore?: number | null;
  status: string;
  sampleOriginalQuestion?: string | null;
  sampleOriginalAnswer?: string | null;
  sampleImprovedAnswer?: string | null;
  sampleWhyBetter?: string | null;
}

export async function requestInterviewReviews() {
  return parseResponse<{ reviews: InterviewReviewSummary[] }>(
    await authFetch("/api/interview/sessions", {
      method: "GET",
    })
  );
}

export interface DashboardData {
  stats: {
    completedTrainings: number;
    averageScore: number;
    storyCount: number;
  };
  recentReview: {
    id: string;
    title: string;
    roleTrack: string;
    focus: string;
    score: number | null;
    rating: string | null;
    lastTestedSkill: string | null;
    updatedAt: string;
  } | null;
  roleSummaries: Array<{
    roleTrack: string;
    sessions: number;
    avgScore: number;
  }>;
}

export async function requestDashboardData() {
  return parseResponse<{ dashboard: DashboardData }>(
    await authFetch("/api/dashboard", {
      method: "GET",
    })
  );
}

export interface DocumentSummary {
  id: string;
  source: "asset" | "legacyResume" | "legacyJd";
  kind: "resume" | "jd" | "general";
  type: string;
  title: string;
  fileName?: string | null;
  mimeType?: string | null;
  track: string;
  status: string;
  updated: string;
  size: string;
  textSize?: string;
  canView?: boolean;
  canDownload?: boolean;
}

export async function requestDocuments() {
  return parseResponse<{ documents: DocumentSummary[] }>(
    await authFetch("/api/documents", {
      method: "GET",
    })
  );
}

export interface ReusableDocument {
  id: string;
  kind: "resume" | "jd";
  title: string;
  fileName: string;
  size: string;
  updated: string;
}

export async function requestReusableDocuments() {
  return parseResponse<{ documents: ReusableDocument[] }>(
    await authFetch("/api/documents?reusable=1", {
      method: "GET",
    })
  );
}

export interface DocumentDetail {
  id: string;
  kind: "resume" | "jd" | "general";
  title: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  parsedText: string;
  parseStatus: string;
  parseError: string | null;
  updatedAt: string;
}

export async function requestDocumentDetail(id: string) {
  return parseResponse<{ document: DocumentDetail }>(
    await authFetch(`/api/documents/${id}`, {
      method: "GET",
    })
  );
}

export async function uploadDocument(input: { file: File; kind: "resume" | "jd" | "general"; title?: string }) {
  const form = new FormData();
  form.set("file", input.file);
  form.set("kind", input.kind);
  if (input.title) form.set("title", input.title);

  return parseResponse<{ document: DocumentDetail }>(
    await authFetch("/api/documents", {
      method: "POST",
      body: form,
    })
  );
}

export async function renameDocument(id: string, title: string) {
  return parseResponse<{ document: DocumentDetail }>(
    await authFetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
  );
}

export async function deleteDocument(id: string) {
  return parseResponse<{ ok: boolean }>(
    await authFetch(`/api/documents/${id}`, {
      method: "DELETE",
    })
  );
}

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

export async function requestStories() {
  return parseResponse<{ stories: StoryCard[] }>(
    await authFetch("/api/stories", {
      method: "GET",
    })
  );
}

export async function generateStories() {
  return parseResponse<{ stories: StoryCard[] }>(
    await authFetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate" }),
    })
  );
}

export async function saveStory(input: Partial<StoryCard>) {
  return parseResponse<{ story: StoryCard }>(
    await authFetch("/api/stories", {
      method: input.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}

export async function deleteStory(id: string) {
  return parseResponse<{ ok: boolean }>(
    await authFetch(`/api/stories?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    })
  );
}

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

export async function requestQuestions() {
  return parseResponse<{ questions: QuestionItem[] }>(
    await authFetch("/api/questions", {
      method: "GET",
    })
  );
}

export async function generateQuestions() {
  return parseResponse<{ questions: QuestionItem[] }>(
    await authFetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate" }),
    })
  );
}

export interface FullReviewResult {
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  repeatedProblems: string[];
  answerQuality: Record<string, unknown>;
  jdFitAnalysis: Record<string, unknown>;
  improvedAnswerExamples: Array<Record<string, unknown>>;
  nextTrainingFocus: string[];
  actionPlan: Array<Record<string, unknown>>;
  rating: string;
}

export async function requestSessionReview(sessionId: string) {
  return parseResponse<{ review: FullReviewResult }>(
    await authFetch("/api/interview/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
  );
}

export interface ModelConfig {
  id: string;
  provider: "mock" | "deepseek" | "openai" | "qwen" | "kimi" | "custom";
  model: string;
  baseUrl: string | null;
  maskedKey: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  warning: string | null;
}

export interface UserPreferences {
  interviewStyle: "friendly" | "logic" | "challenge";
  interviewLanguage: "zh-CN" | "en-US" | "mixed";
  pressureMode: boolean;
  notificationsEnabled: boolean;
  reminderEnabled: boolean;
  weeklyReviewEnabled: boolean;
  updatedAt: string;
}

export interface SettingsUserProfile {
  id: string;
  email: string | null;
  name: string | null;
}

export async function requestUserPreferences() {
  return parseResponse<{ user: SettingsUserProfile; preferences: UserPreferences }>(
    await authFetch("/api/settings/preferences", {
      method: "GET",
    })
  );
}

export async function saveUserPreferences(input: {
  name?: string;
  preferences: Partial<Omit<UserPreferences, "updatedAt">>;
}) {
  return parseResponse<{ user: SettingsUserProfile; preferences: UserPreferences }>(
    await authFetch("/api/settings/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}

export async function requestModelConfig() {
  return parseResponse<{ config: ModelConfig | null }>(
    await authFetch("/api/settings/model-config", {
      method: "GET",
    })
  );
}

export async function saveModelConfig(input: {
  provider: string;
  model: string;
  baseUrl: string;
  apiKey?: string;
}) {
  return parseResponse<{ config: ModelConfig }>(
    await authFetch("/api/settings/model-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}

export async function testModelConfig(input: {
  provider: string;
  model: string;
  baseUrl: string;
  apiKey?: string;
}) {
  return parseResponse<{ ok: boolean; message?: string; error?: string }>(
    await authFetch("/api/settings/test-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}
