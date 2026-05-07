module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/server/db/client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "error",
        "warn"
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
}
}),
"[project]/server/db/users.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureDefaultUser",
    ()=>ensureDefaultUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db/client.ts [app-route] (ecmascript)");
;
async function ensureDefaultUser() {
    const id = process.env.DEFAULT_USER_ID || "demo-user";
    const email = process.env.DEFAULT_USER_EMAIL || "demo@jobcopilot.local";
    const name = process.env.DEFAULT_USER_NAME || "George";
    return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].user.upsert({
        where: {
            id
        },
        create: {
            id,
            email,
            name
        },
        update: {
            email,
            name
        },
        select: {
            id: true,
            email: true,
            name: true
        }
    });
}
}),
"[project]/server/auth/getCurrentUser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentUser",
    ()=>getCurrentUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$users$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db/users.ts [app-route] (ecmascript)");
;
async function getCurrentUser() {
    // Temporary single-user resolver. Replace this file with Supabase Auth,
    // Clerk, or another request-aware resolver when login is introduced.
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$users$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureDefaultUser"])();
}
}),
"[project]/server/db/aiSessions.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSessionWithAnalysis",
    ()=>createSessionWithAnalysis,
    "getSessionTurns",
    ()=>getSessionTurns,
    "listInterviewReviews",
    ()=>listInterviewReviews,
    "saveAnswerAndAiResponse",
    ()=>saveAnswerAndAiResponse,
    "saveInitialAiQuestion",
    ()=>saveInitialAiQuestion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db/client.ts [app-route] (ecmascript)");
;
async function createSessionWithAnalysis(input) {
    const resumeText = [
        input.resumeText,
        input.resumeFile?.text
    ].filter(Boolean).join("\n\n");
    return __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
        const resume = resumeText.trim().length > 0 ? await tx.resume.create({
            data: {
                userId: input.userId,
                title: input.resumeFile?.filename || `${input.roleTrack} 简历资料`,
                rawText: resumeText,
                fileName: input.resumeFile?.filename,
                mimeType: input.resumeFile?.mimetype
            }
        }) : null;
        return tx.interviewSession.create({
            data: {
                userId: input.userId,
                resumeId: resume?.id,
                roleTrack: input.roleTrack,
                title: `${input.roleTrack} 模拟面试`,
                status: "analyzed",
                resumeText,
                jdText: input.jdText,
                analysis: input.analysis,
                matchScore: input.analysis.matchScore,
                reviewSummary: input.analysis.summary
            },
            select: {
                id: true,
                roleTrack: true,
                matchScore: true,
                createdAt: true
            }
        });
    });
}
async function saveInitialAiQuestion(input) {
    const session = await getOrCreateSession(input);
    const existingAiMessage = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interviewMessage.findFirst({
        where: {
            sessionId: session.id,
            role: "ai"
        },
        orderBy: {
            createdAt: "asc"
        }
    });
    if (existingAiMessage) {
        return {
            sessionId: session.id
        };
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction([
        __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interviewMessage.create({
            data: {
                sessionId: session.id,
                role: "ai",
                content: input.nextQuestion,
                testedSkill: input.testedSkill,
                evaluation: input.evaluation,
                score: input.evaluation.score || null
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interviewSession.update({
            where: {
                id: session.id
            },
            data: {
                status: "interviewing",
                lastTestedSkill: input.testedSkill,
                reviewSummary: input.evaluation.summary
            }
        })
    ]);
    return {
        sessionId: session.id
    };
}
async function saveAnswerAndAiResponse(input) {
    const session = await getOrCreateSession(input);
    await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
        await tx.interviewMessage.create({
            data: {
                sessionId: session.id,
                role: "user",
                content: input.answer
            }
        });
        await tx.interviewMessage.create({
            data: {
                sessionId: session.id,
                role: "ai",
                content: input.nextQuestion,
                testedSkill: input.testedSkill,
                evaluation: input.evaluation,
                score: input.evaluation.score || null
            }
        });
        await tx.interviewSession.update({
            where: {
                id: session.id
            },
            data: {
                status: "review_ready",
                overallScore: input.evaluation.score || null,
                overallRating: ratingFromScore(input.evaluation.score),
                reviewSummary: input.evaluation.summary,
                lastTestedSkill: input.testedSkill
            }
        });
        await tx.review.upsert({
            where: {
                sessionId: session.id
            },
            create: {
                userId: input.userId,
                sessionId: session.id,
                title: `${session.roleTrack} 模拟复盘`,
                summary: input.evaluation.summary,
                score: input.evaluation.score || null,
                rating: ratingFromScore(input.evaluation.score),
                strengths: input.evaluation.strengths,
                improvements: input.evaluation.improvements
            },
            update: {
                summary: input.evaluation.summary,
                score: input.evaluation.score || null,
                rating: ratingFromScore(input.evaluation.score),
                strengths: input.evaluation.strengths,
                improvements: input.evaluation.improvements
            }
        });
    });
    return {
        sessionId: session.id
    };
}
async function getSessionTurns(userId, sessionId) {
    const messages = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interviewMessage.findMany({
        where: {
            session: {
                id: sessionId,
                userId
            }
        },
        orderBy: {
            createdAt: "asc"
        },
        select: {
            role: true,
            content: true
        }
    });
    return messages.filter((message)=>message.role === "ai" || message.role === "user").map((message)=>({
            role: message.role,
            content: message.content
        }));
}
async function listInterviewReviews(userId) {
    const sessions = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interviewSession.findMany({
        where: {
            userId
        },
        orderBy: {
            updatedAt: "desc"
        },
        take: 20,
        include: {
            messages: {
                orderBy: {
                    createdAt: "desc"
                },
                take: 1,
                select: {
                    evaluation: true,
                    testedSkill: true,
                    createdAt: true
                }
            },
            review: true
        }
    });
    return sessions.map((session)=>({
            id: session.id,
            title: session.review?.title || `${session.roleTrack} 模拟面试`,
            roleTrack: session.roleTrack,
            date: session.updatedAt.toISOString(),
            score: session.review?.score ?? session.overallScore ?? session.matchScore ?? 0,
            rating: session.review?.rating || session.overallRating || ratingFromScore(session.overallScore || session.matchScore || 0),
            focus: session.review?.summary || session.reviewSummary || "已完成分析，等待继续模拟面试。",
            tags: [
                session.roleTrack,
                session.lastTestedSkill || session.messages[0]?.testedSkill || "人岗匹配分析",
                session.status === "review_ready" ? "已生成复盘" : "已保存进度"
            ],
            matchScore: session.matchScore,
            status: session.status
        }));
}
async function getOrCreateSession(input) {
    if (input.sessionId) {
        const session = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interviewSession.findFirst({
            where: {
                id: input.sessionId,
                userId: input.userId
            },
            select: {
                id: true,
                roleTrack: true
            }
        });
        if (session) return session;
    }
    const created = await createSessionWithAnalysis({
        userId: input.userId,
        roleTrack: input.roleTrack,
        resumeText: input.resumeText,
        jdText: input.jdText,
        analysis: input.analysis || fallbackAnalysis(input.roleTrack)
    });
    return {
        id: created.id,
        roleTrack: created.roleTrack
    };
}
function fallbackAnalysis(roleTrack) {
    return {
        matchScore: 75,
        roleTrack,
        summary: "基础模拟面试模式。",
        strengths: [],
        weaknesses: [],
        predictedQuestions: [],
        trainingPlan: []
    };
}
function ratingFromScore(score) {
    if (!score) return null;
    if (score >= 90) return "A";
    if (score >= 85) return "A-";
    if (score >= 80) return "B+";
    if (score >= 75) return "B";
    if (score >= 70) return "B-";
    return "C";
}
}),
"[project]/server/ai/providers.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chatCompletion",
    ()=>chatCompletion,
    "generateJson",
    ()=>generateJson,
    "isMockProvider",
    ()=>isMockProvider
]);
const providerDefaults = {
    openai: {
        baseUrl: "https://api.openai.com/v1",
        model: "gpt-4o-mini"
    },
    deepseek: {
        baseUrl: "https://api.deepseek.com/v1",
        model: "deepseek-chat"
    },
    qwen: {
        baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        model: "qwen-plus"
    },
    kimi: {
        baseUrl: "https://api.moonshot.cn/v1",
        model: "moonshot-v1-8k"
    }
};
function getProviderConfig() {
    const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();
    const defaults = providerDefaults[provider] ?? providerDefaults.openai;
    return {
        provider,
        apiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.QWEN_API_KEY || process.env.KIMI_API_KEY,
        baseUrl: process.env.AI_BASE_URL || defaults.baseUrl,
        model: process.env.AI_MODEL || defaults.model
    };
}
function isMockProvider() {
    const config = getProviderConfig();
    return config.provider === "mock" || !config.apiKey;
}
async function chatCompletion(messages, options = {}) {
    const config = getProviderConfig();
    if (isMockProvider()) {
        throw new Error("AI provider is mock or API key is missing.");
    }
    const response = await fetch(`${config.baseUrl?.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: config.model,
            messages,
            temperature: options.temperature ?? 0.3,
            response_format: options.responseFormat === "json" ? {
                type: "json_object"
            } : undefined
        })
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`AI request failed: ${response.status} ${text.slice(0, 500)}`);
    }
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
        throw new Error("AI response did not include message content.");
    }
    return content;
}
async function generateJson(messages, mockValue) {
    if (isMockProvider()) {
        return mockValue;
    }
    const content = await chatCompletion(messages, {
        responseFormat: "json",
        temperature: 0.2
    });
    return parseJsonContent(content);
}
function parseJsonContent(content) {
    const trimmed = content.trim();
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const jsonText = fenced?.[1] ?? trimmed;
    try {
        return JSON.parse(jsonText);
    } catch  {
        const start = jsonText.indexOf("{");
        const end = jsonText.lastIndexOf("}");
        if (start >= 0 && end > start) {
            return JSON.parse(jsonText.slice(start, end + 1));
        }
        throw new Error("Unable to parse AI JSON response.");
    }
}
}),
"[project]/server/ai/prompts.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildAnalysisPrompt",
    ()=>buildAnalysisPrompt,
    "buildInterviewPrompt",
    ()=>buildInterviewPrompt
]);
function buildAnalysisPrompt(input) {
    return [
        {
            role: "system",
            content: "你是资深求职面试教练。你必须只输出 JSON，不要 Markdown。请基于简历、JD 和岗位方向，生成结构化面试准备分析。"
        },
        {
            role: "user",
            content: `
岗位方向：${input.roleTrack}

简历内容：
${input.resumeText || "未提供"}

JD 内容：
${input.jdText || "未提供"}

请输出 JSON，字段必须为：
{
  "matchScore": number,
  "roleTrack": string,
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "predictedQuestions": string[],
  "trainingPlan": [{ "title": string, "reason": string }]
}
要求：
- matchScore 为 0-100。
- strengths 3-5 条。
- weaknesses 3-5 条。
- predictedQuestions 4-6 条，要像真实面试官会追问的问题。
- trainingPlan 2-4 条，要可执行。
`
        }
    ];
}
function buildInterviewPrompt(input) {
    const history = input.history.map((turn)=>`${turn.role === "ai" ? "AI 面试官" : "候选人"}：${turn.content}`).join("\n");
    return [
        {
            role: "system",
            content: "你是严格但专业的 AI 面试官兼教练。你必须只输出 JSON，不要 Markdown。你会评价候选人当前回答，并给出下一道追问。"
        },
        {
            role: "user",
            content: `
岗位方向：${input.roleTrack}

简历内容：
${input.resumeText || "未提供"}

JD 内容：
${input.jdText || "未提供"}

分析报告：
${JSON.stringify(input.analysis)}

历史对话：
${history || "暂无"}

候选人刚刚回答：
${input.answer || "候选人尚未回答，这是第一轮。"}

请输出 JSON：
{
  "evaluation": {
    "score": number,
    "summary": string,
    "strengths": string[],
    "improvements": string[],
    "rewrittenAnswer": string
  },
  "nextQuestion": string,
  "testedSkill": string
}
要求：
- score 为 0-100。
- rewrittenAnswer 使用 STAR 或“结论-证据-指标-反思”结构。
- nextQuestion 必须基于候选人的回答继续追问，不要泛泛而谈。
`
        }
    ];
}
}),
"[project]/server/services/interview.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInterviewTurn",
    ()=>createInterviewTurn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/ai/providers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/ai/prompts.ts [app-route] (ecmascript)");
;
;
async function createInterviewTurn(input) {
    const normalized = {
        roleTrack: input.roleTrack?.trim() || input.analysis?.roleTrack || "技术岗",
        resumeText: input.resumeText?.trim() || "",
        jdText: input.jdText?.trim() || "",
        analysis: input.analysis || defaultAnalysis(input.roleTrack || "技术岗"),
        history: input.history || [],
        answer: input.answer?.trim() || ""
    };
    const firstRound = !normalized.answer;
    const mock = {
        evaluation: {
            score: firstRound ? 0 : 82,
            summary: firstRound ? "面试已开始，请先回答第一题。" : "回答结构清楚，但还可以补充更明确的业务指标和取舍依据。",
            strengths: firstRound ? [] : [
                "能说明自己的角色",
                "有项目背景",
                "表达节奏稳定"
            ],
            improvements: firstRound ? [] : [
                "补充量化结果",
                "说明为什么选择这个方案",
                "增加复盘反思"
            ],
            rewrittenAnswer: firstRound ? "" : "当时项目面临性能和迭代效率双重压力。我负责设计渐进迁移方案，先建立新老系统共存机制，再逐步替换核心链路。最终关键页面性能提升，并降低后续迭代成本。"
        },
        nextQuestion: firstRound ? "请先用 2-3 分钟介绍一个最能代表你岗位能力的项目，重点说明背景、你的职责、关键行动和结果。" : "你刚才提到了项目效果，请进一步说明：你们当时用哪些指标判断这个方案是成功的？",
        testedSkill: firstRound ? "项目完整表达" : "业务指标与结果验证"
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateJson"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildInterviewPrompt"])(normalized), mock);
}
function defaultAnalysis(roleTrack) {
    return {
        matchScore: 75,
        roleTrack,
        summary: "基础模拟面试模式。",
        strengths: [],
        weaknesses: [],
        predictedQuestions: [],
        trainingPlan: []
    };
}
}),
"[project]/src/app/api/interview/message/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/auth/getCurrentUser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$aiSessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db/aiSessions.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$services$2f$interview$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/services/interview.ts [app-route] (ecmascript)");
;
;
;
;
const runtime = "nodejs";
async function POST(request) {
    try {
        const body = await request.json().catch(()=>({}));
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$services$2f$interview$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createInterviewTurn"])(body);
        const persistenceInput = {
            userId: user.id,
            sessionId: body.sessionId,
            roleTrack: body.roleTrack || body.analysis?.roleTrack || result.testedSkill || "技术岗",
            resumeText: body.resumeText || "",
            jdText: body.jdText || "",
            analysis: body.analysis,
            nextQuestion: result.nextQuestion,
            testedSkill: result.testedSkill,
            evaluation: result.evaluation
        };
        const saved = body.answer ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$aiSessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveAnswerAndAiResponse"])({
            ...persistenceInput,
            answer: body.answer
        }) : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$aiSessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveInitialAiQuestion"])(persistenceInput);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...result,
            sessionId: saved.sessionId
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__00286a8._.js.map