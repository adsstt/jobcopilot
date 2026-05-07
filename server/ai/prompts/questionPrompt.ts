export interface QuestionGenerationPromptInput {
  resumeText: string;
  jdText: string;
  analysisText: string;
  reviewText: string;
  storyText: string;
}

export function buildQuestionGenerationPrompt(input: QuestionGenerationPromptInput) {
  return [
    {
      role: "system" as const,
      content:
        "你是个人面试题库生成助手。你只输出合法 JSON，不输出 Markdown。请基于用户真实简历、JD、分析报告、复盘和故事库，生成个人化面试训练题。不得虚构用户经历。",
    },
    {
      role: "user" as const,
      content: `
【简历】
${input.resumeText || "未提供"}

【JD】
${input.jdText || "未提供"}

【分析报告】
${input.analysisText || "未提供"}

【复盘】
${input.reviewText || "未提供"}

【故事库】
${input.storyText || "未提供"}

请严格返回 JSON：
{
  "questions": [
    {
      "question": "题目",
      "questionType": "项目深挖/能力验证/业务理解/动机匹配/压力风险/技术细节/反问能力/其他",
      "relatedSkill": "关联能力",
      "source": "ai_generated",
      "difficulty": "基础/中等/困难",
      "answerStrategy": "建议回答策略",
      "relatedStoryId": null
    }
  ]
}

要求：
- 生成 6-10 题。
- 优先围绕用户真实 Gap、JD 核心要求、复盘薄弱点和高频故事。
- 每题只能问一个问题。
- 题目要具体、场景化、可验证。
- 全部使用中文。
`,
    },
  ];
}
