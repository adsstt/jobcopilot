export interface StoryExtractionPromptInput {
  resumes: string;
  interviewMessages: string;
  improvedAnswers: string;
  fullReviews: string;
}

export function buildStoryExtractionPrompt(input: StoryExtractionPromptInput) {
  return [
    {
      role: "system" as const,
      content:
        "你是面试故事库结构化助手。你只输出合法 JSON，不输出 Markdown。请从候选人的简历、面试消息和复盘中提取可长期复用的 STAR 项目故事。不得虚构经历、项目、数据或结果；如果材料没有体现，只能写“未体现，建议补充”。",
    },
    {
      role: "user" as const,
      content: `
请基于以下材料提取 1-5 个候选 STAR 故事。

【简历材料】
${input.resumes || "未提供"}

【面试对话】
${input.interviewMessages || "未提供"}

【复盘优化回答】
${input.improvedAnswers || "未提供"}

【完整复盘】
${input.fullReviews || "未提供"}

请严格返回 JSON：
{
  "stories": [
    {
      "title": "故事标题",
      "background": "Situation 背景",
      "task": "Task 任务",
      "action": "Action 行动",
      "result": "Result 结果",
      "relatedSkill": "关联能力",
      "relatedJDKeywords": ["JD关键词"],
      "confidenceScore": 0,
      "isHighFrequency": false,
      "source": "resume/interview/review/mixed"
    }
  ]
}

规则：
- 每个故事必须围绕一个真实项目、经历或回答素材。
- 优先沉淀复盘中的 improvedAnswer，因为它已经经过优化。
- confidenceScore 取 0-100：材料越完整、越有数据、越可验证，分数越高。
- isHighFrequency=true 仅用于常见面试高频素材，如项目深挖、冲突协作、技术方案、业务结果、失败复盘。
- 全部使用中文输出。
`,
    },
  ];
}
