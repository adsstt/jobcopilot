import { generateJson, streamJsonWithDeltas } from "../ai/providers";
import { buildInterviewPrompt } from "../ai/prompts";
import type { InterviewMessageRequest, InterviewMessageResponse, MatchAnalysis } from "../types";

export async function createInterviewTurn(input: InterviewMessageRequest): Promise<InterviewMessageResponse> {
  const { normalized, mock } = buildInterviewContext(input);
  const forced = buildForcedClosingTurn(normalized);
  if (forced) return forced;

  const result = await generateJson<Record<string, any>>(buildInterviewPrompt(normalized), mock);
  return enforceStageControl(normalized, normalizeInterviewResult(result, mock), mock);
}

export async function createInterviewTurnStream(
  input: InterviewMessageRequest,
  onDelta: (text: string) => void | Promise<void>
): Promise<InterviewMessageResponse> {
  const { normalized, mock } = buildInterviewContext(input);
  const forced = buildForcedClosingTurn(normalized);
  if (forced) {
    await streamText(forced.nextQuestion, onDelta);
    return forced;
  }

  const result = await streamJsonWithDeltas<Record<string, any>>(buildInterviewPrompt(normalized), mock, {
    displayKey: "nextQuestion",
    onDelta,
  });

  return enforceStageControl(normalized, normalizeInterviewResult(result, mock), mock);
}

function buildInterviewContext(input: InterviewMessageRequest) {
  const normalized = {
    roleTrack: input.roleTrack?.trim() || input.analysis?.roleTrack || "技术岗",
    interviewType: input.interviewType || "业务面",
    interviewStyle: input.interviewStyle || "friendly",
    interviewStyleInstruction: input.interviewStyleInstruction || "外企温和流：礼貌、鼓励、结构化反馈，在追问时保持支持性和清晰边界。",
    interviewLanguage: input.interviewLanguage || "zh-CN",
    interviewLanguageInstruction: input.interviewLanguageInstruction || "全程使用中文普通话表达。",
    pressureMode: Boolean(input.pressureMode),
    resumeText: input.resumeText?.trim() || "",
    jdText: input.jdText?.trim() || "",
    analysis: input.analysis || defaultAnalysis(input.roleTrack || "技术岗"),
    history: input.history || [],
    answer: input.answer?.trim() || "",
  };

  const firstRound = !normalized.answer;

  const mock: InterviewMessageResponse = {
    currentStage: firstRound ? "opening" : "formal",
    shouldMoveToNextStage: !firstRound,
    interviewType: "业务面",
    feedback: firstRound ? "第一轮应先完成自我介绍。" : "回答结构清楚，但细节和数据还可以加强。",
    improvement: firstRound ? "请围绕目标岗位、核心经历和量化成果进行 1-2 分钟介绍。" : "补充你的个人角色、关键动作、工具方法和可验证结果。",
    improvedAnswer: firstRound
      ? ""
      : "我主导 React 迁移时，先识别性能瓶颈和迁移风险，再设计新老系统共存方案，逐步替换核心链路，并用性能指标验证效果。",
    followUpReason: firstRound ? "opening 阶段必须先考察自我介绍。" : "继续验证候选人是否能用数据证明项目价值。",
    isClosing: false,
    evaluation: {
      score: firstRound ? 0 : 82,
      summary: firstRound ? "面试已开始，请先回答第一题。" : "回答结构清楚，但还可以补充更明确的业务指标和取舍依据。",
      strengths: firstRound ? [] : ["能说明自己的角色", "有项目背景", "表达节奏稳定"],
      improvements: firstRound ? [] : ["补充量化结果", "说明为什么选择这个方案", "增加复盘反思"],
      rewrittenAnswer: firstRound
        ? ""
        : "当时项目面临性能和迭代效率双重压力。我负责设计渐进迁移方案，先建立新老系统共存机制，再逐步替换核心链路。最终关键页面性能提升，并降低后续迭代成本。",
    },
    nextQuestion: firstRound
      ? "请先做一个 1-2 分钟的自我介绍，重点说明你的目标岗位、最相关的核心经历，以及能证明你能力的量化成果。"
      : "你刚才提到了项目效果，请进一步说明：你们当时用哪些指标判断这个方案是成功的？",
    testedSkill: firstRound ? "项目完整表达" : "业务指标与结果验证",
  };

  return { normalized, mock };
}

function buildForcedClosingTurn(input: ReturnType<typeof buildInterviewContext>["normalized"]): InterviewMessageResponse | null {
  const lastAnswer = input.answer.trim();
  const isClosingHistory = hasClosingHistorySafe(input.history);

  if (isClosingHistory && isEndInterviewIntentSafe(lastAnswer)) {
    return {
      currentStage: "review",
      shouldMoveToNextStage: true,
      interviewType: input.interviewType,
      feedback: "你已确认结束反问环节，本次模拟面试可以进入复盘。",
      improvement: "复盘时重点关注回答是否有岗位相关性、个人角色、具体动作和量化结果。",
      improvedAnswer: "本次面试可以结束。建议复盘时把核心项目按 STAR 结构补齐背景、任务、行动和结果，并补充可验证数据。",
      followUpReason: "用户在反问环节后主动结束面试，进入真实面试后的复盘阶段",
      isClosing: false,
      evaluation: {
        score: 82,
        summary: "面试已结束，进入复盘阶段。",
        strengths: ["能够完成正式问答和反问收尾。"],
        improvements: ["后续复盘需要重点补强岗位相关性、量化结果和 STAR 表达。"],
        rewrittenAnswer: "本次面试可以结束。建议复盘时把核心项目按 STAR 结构补齐背景、任务、行动和结果，并补充可验证数据。",
      },
      nextQuestion: "好的，本次模拟面试到这里结束。你可以点击结束按钮进入复盘，查看本次表现总结、待提升点和回答优化建议。",
      testedSkill: "面试复盘",
    };
  }

  if (isClosingHistory && lastAnswer) {
    return {
      currentStage: "closing",
      shouldMoveToNextStage: true,
      interviewType: input.interviewType,
      feedback: evaluateReverseQuestion(lastAnswer),
      improvement: "建议把问题从福利或泛泛了解，升级为围绕岗位目标、团队协作机制、业务挑战或绩效标准的高质量反问。",
      improvedAnswer: optimizeReverseQuestion(lastAnswer),
      followUpReason: "用户已经进入反问环节，本轮评价其反问问题质量，并引导是否结束进入复盘。",
      isClosing: true,
      evaluation: {
        score: scoreReverseQuestion(lastAnswer),
        summary: evaluateReverseQuestion(lastAnswer),
        strengths: ["能主动进入反问环节，说明有面试互动意识。"],
        improvements: ["反问可以更聚焦岗位目标、业务挑战和评价标准。"],
        rewrittenAnswer: optimizeReverseQuestion(lastAnswer),
      },
      nextQuestion: "这个反问方向可以继续打磨。你还想再补充 1 个反问问题，还是结束面试并生成本次复盘？",
      testedSkill: "反问能力",
    };
  }

  if (!isEndInterviewIntentSafe(lastAnswer)) return null;

  const nextQuestion = "好的，正式面试环节先到这里。现在进入反问环节，你可以向面试官提 1 个问题。建议围绕岗位目标、团队协作、成长路径或业务挑战来提问。";

  return {
    currentStage: "closing",
    shouldMoveToNextStage: true,
    interviewType: input.interviewType,
    feedback: "你已主动结束正式面试，接下来应该进入真实面试中的反问环节。",
    improvement: "建议至少准备 1 个与岗位目标、团队协作、成长路径或业务挑战相关的问题，避免只问福利和作息。",
    improvedAnswer: "我想了解这个岗位入职后前三个月最核心的目标是什么，以及团队会如何衡量这个阶段的产出质量？",
    followUpReason: "用户主动结束正式面试，进入真实面试中的反问环节",
    isClosing: true,
    evaluation: {
      score: 78,
      summary: "正式问答已结束，当前进入反问环节。",
      strengths: ["能主动表达收尾意图。"],
      improvements: ["需要用高质量反问展示岗位理解和长期匹配度。"],
      rewrittenAnswer: "我想了解这个岗位入职后前三个月最核心的目标是什么，以及团队会如何衡量这个阶段的产出质量？",
    },
    nextQuestion,
    testedSkill: "反问能力",
  };
}

function normalizeInterviewResult(result: Record<string, any>, fallback: InterviewMessageResponse): InterviewMessageResponse {
  const legacyEvaluation = result.evaluation && typeof result.evaluation === "object" ? result.evaluation : null;
  const score = Number.isFinite(Number(result.score)) ? Number(result.score) : legacyEvaluation?.score ?? fallback.evaluation.score;
  const summary = stringOrFallback(result.evaluation, legacyEvaluation?.summary, fallback.evaluation.summary);
  const feedback = stringOrFallback(result.feedback, "");
  const improvement = stringOrFallback(result.improvement, "");
  const improvedAnswer = stringOrFallback(result.improvedAnswer, legacyEvaluation?.rewrittenAnswer, fallback.evaluation.rewrittenAnswer);

  return {
    ...result,
    currentStage: normalizeStage(result.currentStage) || fallback.currentStage,
    shouldMoveToNextStage: typeof result.shouldMoveToNextStage === "boolean" ? result.shouldMoveToNextStage : fallback.shouldMoveToNextStage,
    interviewType: normalizeInterviewType(result.interviewType) || fallback.interviewType,
    feedback,
    improvement,
    improvedAnswer,
    followUpReason: stringOrFallback(result.followUpReason, fallback.followUpReason),
    isClosing: typeof result.isClosing === "boolean" ? result.isClosing : fallback.isClosing,
    evaluation: {
      score,
      summary,
      strengths: arrayOrFallback(legacyEvaluation?.strengths, feedback ? [feedback] : [], fallback.evaluation.strengths),
      improvements: arrayOrFallback(legacyEvaluation?.improvements, improvement ? [improvement] : [], fallback.evaluation.improvements),
      rewrittenAnswer: improvedAnswer,
    },
    nextQuestion: stringOrFallback(result.nextQuestion, fallback.nextQuestion),
    testedSkill: stringOrFallback(result.testedSkill, fallback.testedSkill),
  };
}

function enforceStageControl(
  input: ReturnType<typeof buildInterviewContext>["normalized"],
  result: InterviewMessageResponse,
  fallback: InterviewMessageResponse
): InterviewMessageResponse {
  const isClosingHistory = hasClosingHistorySafe(input.history);
  const userRounds = input.history.filter((turn) => turn.role === "user").length || (input.answer ? 1 : 0);

  if (!isClosingHistory && !isEndInterviewIntentSafe(input.answer) && userRounds > 0 && userRounds < 5 && (result.currentStage === "closing" || result.currentStage === "review" || result.isClosing)) {
    const nextQuestion = buildFormalFallbackQuestion(input, result, fallback);
    return {
      ...result,
      currentStage: "formal",
      shouldMoveToNextStage: false,
      isClosing: false,
      followUpReason: "候选人尚未主动结束，且正式面试轮次不足，系统强制继续 formal 阶段并基于 JD/analysisResult 提问。",
      nextQuestion,
      testedSkill: result.testedSkill && result.testedSkill !== "反问能力" && result.testedSkill !== "面试复盘" ? result.testedSkill : "岗位核心能力验证",
    };
  }

  return result;
}

function buildFormalFallbackQuestion(
  input: ReturnType<typeof buildInterviewContext>["normalized"],
  result: InterviewMessageResponse,
  fallback: InterviewMessageResponse
) {
  const analysis = input.analysis as any;
  const suggested = firstString(
    analysis?.suggestedQuestions?.map((item: any) => item?.question),
    analysis?.interviewPreparation?.likelyQuestions?.map((item: any) => item?.question),
    analysis?.predictedQuestions,
    result.nextQuestion && !result.nextQuestion.includes("反问") && !result.nextQuestion.includes("复盘") ? [result.nextQuestion] : [],
    [fallback.nextQuestion]
  );

  return suggested || "请结合你刚才的自我介绍，具体讲一个最能证明你匹配目标岗位的项目：当时背景是什么、你负责什么、用了什么方法、最后结果如何？";
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (Array.isArray(value)) {
      const found = value.find((item) => typeof item === "string" && item.trim());
      if (found) return found.trim();
    }
  }
  return "";
}

function normalizeStage(value: unknown) {
  return value === "opening" || value === "formal" || value === "closing" || value === "review" ? value : undefined;
}

function normalizeInterviewType(value: unknown) {
  return value === "HR面" || value === "业务面" || value === "技术面" || value === "终面" ? value : undefined;
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

function isEndInterviewIntentSafe(answer: string) {
  const normalized = answer.trim().toLowerCase();
  if (!normalized) return false;

  const chineseMatched = [
    "\u7ed3\u675f",
    "\u7ed3\u675f\u9762\u8bd5",
    "\u6211\u60f3\u7ed3\u675f\u9762\u8bd5",
    "\u53ef\u4ee5\u7ed3\u675f\u4e86",
    "\u6ca1\u6709\u4e86",
    "\u5148\u5230\u8fd9\u91cc",
  ].some((keyword) => normalized.includes(keyword));

  return chineseMatched || /\b(stop|end)\b/i.test(normalized);
}

function hasClosingHistorySafe(history: { role: "ai" | "user"; content: string }[]) {
  return history.some((turn) => {
    if (turn.role !== "ai") return false;
    return (
      turn.content.includes("\u73b0\u5728\u8fdb\u5165\u53cd\u95ee\u73af\u8282") ||
      turn.content.includes("\u4f60\u53ef\u4ee5\u5411\u9762\u8bd5\u5b98\u63d0 1 \u4e2a\u95ee\u9898") ||
      turn.content.includes("\u53cd\u95ee\u73af\u8282") ||
      turn.content.includes("\u53cd\u95ee\u80fd\u529b")
    );
  });
}

function isEndInterviewIntent(answer: string) {
  const normalized = answer.trim().toLowerCase();
  if (!normalized) return false;

  const chineseMatched = [
    "结束",
    "结束面试",
    "我想结束面试",
    "可以结束了",
    "没有了",
    "先到这里",
  ].some((keyword) => normalized.includes(keyword.toLowerCase()));

  if (chineseMatched) return true;

  return /\b(stop|end)\b/i.test(normalized);
}

function hasClosingHistory(history: { role: "ai" | "user"; content: string }[]) {
  return history.some((turn) => {
    if (turn.role !== "ai") return false;
    return turn.content.includes("现在进入反问环节") || turn.content.includes("你可以向面试官提 1 个问题");
  });
}

function evaluateReverseQuestion(question: string) {
  if (hasBusinessDepth(question)) {
    return "这个反问具备一定业务深度，能体现你对岗位目标、团队协作或业务挑战的关注。";
  }
  return "这个反问还偏泛，可以进一步聚焦岗位目标、业务挑战、协作方式或绩效标准，让面试官感受到你的岗位理解。";
}

function optimizeReverseQuestion(question: string) {
  if (question.includes("目标") || question.includes("业务") || question.includes("挑战")) {
    return "我想进一步了解这个岗位在未来 3-6 个月最重要的业务目标是什么，以及团队目前最大的挑战在哪里？";
  }
  if (question.includes("团队") || question.includes("协作")) {
    return "我想了解这个岗位日常会和哪些团队高频协作，以及团队判断协作质量的关键标准是什么？";
  }
  if (question.includes("成长") || question.includes("发展")) {
    return "我想了解团队对这个岗位的成长路径有什么期待，以及优秀成员通常会在哪些能力上形成突破？";
  }
  return "我想了解这个岗位入职后前三个月最核心的目标是什么，以及团队会如何衡量这个阶段的产出质量？";
}

function scoreReverseQuestion(question: string) {
  return hasBusinessDepth(question) ? 86 : 74;
}

function hasBusinessDepth(question: string) {
  return ["目标", "业务", "挑战", "团队", "协作", "成长", "路径", "绩效", "标准", "衡量", "产出"].some((keyword) => question.includes(keyword));
}

async function streamText(text: string, onDelta: (text: string) => void | Promise<void>) {
  const parts = text.match(/.{1,4}/gs) || [];
  for (const part of parts) {
    await onDelta(part);
    await new Promise((resolve) => setTimeout(resolve, 24));
  }
}

function defaultAnalysis(roleTrack: string): MatchAnalysis {
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
