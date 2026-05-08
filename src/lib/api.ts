import { normalizeResponseError } from "./appErrors";

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
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw normalizeResponseError(data?.error, `Request failed with ${response.status}`);
  }
  return data as T;
}

export async function requestAnalysis(input: AnalysisInput) {
  if (input.resumeFile || input.jdFile) {
    const form = new FormData();
    form.set("roleTrack", input.roleTrack);
    form.set("resumeText", input.resumeText);
    form.set("jdText", input.jdText);
    if (input.resumeFile) form.set("resume", input.resumeFile);
    if (input.jdFile) form.set("jd", input.jdFile);

    return parseResponse<MatchAnalysis>(
      await fetch("/api/analysis", {
        method: "POST",
        body: form,
      })
    );
  }

  return parseResponse<MatchAnalysis>(
    await fetch("/api/analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roleTrack: input.roleTrack,
        resumeText: input.resumeText,
        jdText: input.jdText,
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
    await fetch("/api/interview/message", {
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
  const response = await fetch("/api/interview/message", {
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
}

export async function requestInterviewReviews() {
  return parseResponse<{ reviews: InterviewReviewSummary[] }>(
    await fetch("/api/interview/sessions", {
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
    await fetch("/api/dashboard", {
      method: "GET",
    })
  );
}

export interface DocumentSummary {
  id: string;
  type: string;
  title: string;
  track: string;
  status: string;
  updated: string;
  size: string;
}

export async function requestDocuments() {
  return parseResponse<{ documents: DocumentSummary[] }>(
    await fetch("/api/documents", {
      method: "GET",
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
    await fetch("/api/stories", {
      method: "GET",
    })
  );
}

export async function generateStories() {
  return parseResponse<{ stories: StoryCard[] }>(
    await fetch("/api/stories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generate" }),
    })
  );
}

export async function saveStory(input: Partial<StoryCard>) {
  return parseResponse<{ story: StoryCard }>(
    await fetch("/api/stories", {
      method: input.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
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
    await fetch("/api/questions", {
      method: "GET",
    })
  );
}

export async function generateQuestions() {
  return parseResponse<{ questions: QuestionItem[] }>(
    await fetch("/api/questions", {
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
    await fetch("/api/interview/review", {
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

export async function requestModelConfig() {
  return parseResponse<{ config: ModelConfig | null }>(
    await fetch("/api/settings/model-config", {
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
    await fetch("/api/settings/model-config", {
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
    await fetch("/api/settings/test-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  );
}
