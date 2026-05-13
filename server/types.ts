export interface AnalysisRequest {
  roleTrack?: string;
  resumeText?: string;
  jdText?: string;
}

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
  trainingPlan: Array<{
    title: string;
    reason: string;
  }>;
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

export interface InterviewMessageRequest {
  sessionId?: string;
  interviewType?: "HR面" | "业务面" | "技术面" | "终面";
  interviewStyle?: string;
  interviewStyleInstruction?: string;
  interviewLanguage?: string;
  interviewLanguageInstruction?: string;
  pressureMode?: boolean;
  roleTrack?: string;
  resumeText?: string;
  jdText?: string;
  analysis?: MatchAnalysis;
  history?: InterviewTurn[];
  answer?: string;
}

export interface InterviewMessageResponse {
  sessionId?: string;
  currentStage?: "opening" | "formal" | "closing" | "review";
  shouldMoveToNextStage?: boolean;
  interviewType?: "HR面" | "业务面" | "技术面" | "终面";
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
