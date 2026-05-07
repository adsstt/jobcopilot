import type { InterviewTurn, MatchAnalysis } from "../../types";

export interface ReviewPromptInput {
  roleTrack: string;
  resumeText?: string;
  jdText?: string;
  analysis?: MatchAnalysis | null;
  history: InterviewTurn[];
}

export function buildReviewPrompt(input: ReviewPromptInput) {
  const history = input.history.map((turn, index) => `${index + 1}. ${turn.role === "ai" ? "AI 面试官" : "候选人"}：${turn.content}`).join("\n");

  return [
    {
      role: "system" as const,
      content:
        "你是资深面试复盘教练。你必须只输出合法 JSON，不要 Markdown，不要代码块。请基于整场模拟面试，而不是最后一轮回答，生成可执行的中文复盘报告。",
    },
    {
      role: "user" as const,
      content: `
岗位方向：
${input.roleTrack}

候选人简历：
${input.resumeText || "未提供"}

目标岗位 JD：
${input.jdText || "未提供"}

前置人岗匹配分析 analysisResult：
${JSON.stringify(input.analysis || {})}

完整面试消息 InterviewMessages：
${history || "暂无"}

请严格输出 JSON：
{
  "overallScore": number,
  "summary": "整体表现总结，必须基于整场面试",
  "strengths": ["优势1", "优势2", "优势3"],
  "weaknesses": ["待提升点1", "待提升点2", "待提升点3"],
  "repeatedProblems": ["整场面试中反复出现的问题"],
  "answerQuality": {
    "structure": "回答结构评价",
    "specificity": "具体性评价",
    "evidence": "证据和数据评价",
    "roleClarity": "个人角色清晰度评价"
  },
  "jdFitAnalysis": {
    "matchedSignals": ["与JD匹配的表现"],
    "riskSignals": ["与JD仍有风险的表现"],
    "gapToAddress": ["下一步需要补齐的岗位差距"]
  },
  "improvedAnswerExamples": [
    {
      "originalQuestion": "面试中的原问题",
      "originalAnswer": "候选人的原回答；如果没有明确原句则写未体现",
      "improvedAnswer": "优化后的示范回答，必须基于用户真实经历，不得虚构",
      "whyBetter": "为什么更好"
    }
  ],
  "nextTrainingFocus": ["下一次训练重点1", "下一次训练重点2", "下一次训练重点3"],
  "actionPlan": [
    {
      "task": "具体提升任务",
      "reason": "为什么要做",
      "howToPractice": "如何练习"
    }
  ]
}

规则：
- 必须基于完整 InterviewMessages，不要只评价最后一轮。
- 必须结合 resumeText、jdText、analysisResult。
- 不能虚构候选人经历、项目、技术细节、业务结果或量化数据。
- 如果用户没有提供数据，只能写“未体现”或“建议补充”，不能编造。
- 建议必须具体、可执行、能用于下一次训练。
- overallScore 为 0-100。
- strengths 1-3 条。
- weaknesses 1-3 条。
- 全部使用中文。
- 输出必须是合法 JSON。
`,
    },
  ];
}
