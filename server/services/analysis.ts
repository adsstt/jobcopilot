import { generateJson } from "../ai/providers";
import { buildAnalysisPrompt } from "../ai/prompts";
import type { AnalysisRequest, MatchAnalysis } from "../types";

export async function createAnalysis(input: AnalysisRequest): Promise<MatchAnalysis> {
  const normalized = {
    roleTrack: input.roleTrack?.trim() || "技术岗",
    resumeText: input.resumeText?.trim() || "",
    jdText: input.jdText?.trim() || "",
  };

  const mock: MatchAnalysis = {
    matchScore: normalized.resumeText && normalized.jdText ? 86 : 72,
    roleTrack: normalized.roleTrack,
    summary: "你的项目经历和目标岗位有较高相关性。当前最强的是项目推进和结构化表达，最需要补强的是业务指标、决策依据和岗位语言转译。",
    strengths: [
      "有完整项目经历，适合展开 STAR 结构回答。",
      "能体现跨团队协作和主动推动能力。",
      "技术或业务实践具备可追问的细节空间。",
    ],
    weaknesses: [
      "简历中量化指标偏少，容易被追问业务价值。",
      "部分经历偏执行描述，需要补充决策和取舍过程。",
      "目标岗位语言还不够聚焦，需要把经历转译成岗位能力。",
    ],
    predictedQuestions: [
      "请讲一个最能代表你岗位能力的项目，并说明你具体负责了什么。",
      "这个项目最终带来了哪些可量化结果？",
      "如果当时资源不足，你是如何做优先级取舍的？",
      "你在这个项目里遇到的最大分歧是什么，最后如何推动达成一致？",
      "如果重做一次，你会改进哪个环节？",
    ],
    trainingPlan: [
      { title: "补充业务指标", reason: "把项目结果从“做了什么”升级为“产生了什么价值”。" },
      { title: "准备压力追问", reason: "针对短板、失败和取舍问题提前组织回答。" },
      { title: "沉淀故事库", reason: "把高频项目改写成不同岗位方向的表达版本。" },
    ],
  };

  const result = await generateJson<Record<string, any>>(buildAnalysisPrompt(normalized), mock);
  return normalizeAnalysisResult(result, normalized.roleTrack, mock);
}

function normalizeAnalysisResult(result: Record<string, any>, roleTrack: string, fallback: MatchAnalysis): MatchAnalysis {
  const capabilityAnalysis = result.capabilityAnalysis || {};
  const interviewPreparation = result.interviewPreparation || {};

  const strengths = arrayOrFallback(
    result.strengths,
    capabilityAnalysis.matched?.map((item: any) => item.interviewSellingPoint || item.whyMatched || item.resumeEvidence),
    result.candidateProfile?.coreSkills,
    fallback.strengths
  );

  const weaknesses = arrayOrFallback(
    result.weaknesses,
    capabilityAnalysis.missing?.map((item: any) => item.gapDescription || item.jdRequirement),
    capabilityAnalysis.partial?.map((item: any) => item.gap || item.jdRequirement),
    result.candidateProfile?.potentialRisks,
    fallback.weaknesses
  );

  const predictedQuestions = arrayOrFallback(
    result.predictedQuestions,
    interviewPreparation.likelyQuestions?.map((item: any) => item.question),
    result.suggestedQuestions?.map((item: any) => item.question),
    fallback.predictedQuestions
  );

  const trainingPlan =
    Array.isArray(result.trainingPlan) && result.trainingPlan.length
      ? result.trainingPlan
      : Array.isArray(result.preparationAdvice?.beforeInterview)
        ? result.preparationAdvice.beforeInterview.slice(0, 4).map((item: string) => ({ title: item, reason: "面试前准备建议" }))
        : fallback.trainingPlan;

  return {
    ...result,
    matchScore: Number.isFinite(Number(result.matchScore)) ? Number(result.matchScore) : fallback.matchScore,
    roleTrack: result.roleTrack || roleTrack,
    summary: result.summary || result.coreSummary || fallback.summary,
    strengths,
    weaknesses,
    predictedQuestions,
    trainingPlan,
  } as MatchAnalysis;
}

function arrayOrFallback(...values: any[]) {
  for (const value of values) {
    if (Array.isArray(value)) {
      const cleaned = value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim());
      if (cleaned.length) return cleaned;
    }
  }

  return [];
}
