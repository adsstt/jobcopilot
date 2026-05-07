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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/server/security/modelConfigCrypto.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "decryptModelApiKey",
    ()=>decryptModelApiKey,
    "encryptModelApiKey",
    ()=>encryptModelApiKey,
    "getModelConfigSecretWarning",
    ()=>getModelConfigSecretWarning
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const DEV_SECRET = "jobcopilot-dev-model-config-secret";
function encryptModelApiKey(apiKey) {
    const key = getEncryptionKey();
    const iv = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomBytes"])(IV_LENGTH);
    const cipher = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createCipheriv"])(ALGORITHM, key, iv, {
        authTagLength: AUTH_TAG_LENGTH
    });
    const encrypted = Buffer.concat([
        cipher.update(apiKey, "utf8"),
        cipher.final()
    ]);
    const authTag = cipher.getAuthTag();
    return [
        iv,
        authTag,
        encrypted
    ].map((part)=>part.toString("base64url")).join(".");
}
function decryptModelApiKey(encryptedValue) {
    const key = getEncryptionKey();
    const [ivText, authTagText, encryptedText] = encryptedValue.split(".");
    if (!ivText || !authTagText || !encryptedText) {
        throw new Error("Invalid encrypted API key format.");
    }
    const decipher = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createDecipheriv"])(ALGORITHM, key, Buffer.from(ivText, "base64url"), {
        authTagLength: AUTH_TAG_LENGTH
    });
    decipher.setAuthTag(Buffer.from(authTagText, "base64url"));
    return Buffer.concat([
        decipher.update(Buffer.from(encryptedText, "base64url")),
        decipher.final()
    ]).toString("utf8");
}
function getModelConfigSecretWarning() {
    if (process.env.MODEL_CONFIG_SECRET) return null;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return "MODEL_CONFIG_SECRET is not set. Development fallback encryption key is being used.";
}
function getEncryptionKey() {
    const secret = process.env.MODEL_CONFIG_SECRET;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["createHash"])("sha256").update(secret || DEV_SECRET).digest();
}
}),
"[project]/server/db/modelConfigs.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDecryptedDefaultModelConfig",
    ()=>getDecryptedDefaultModelConfig,
    "getSafeDefaultModelConfig",
    ()=>getSafeDefaultModelConfig,
    "maskApiKey",
    ()=>maskApiKey,
    "normalizeProvider",
    ()=>normalizeProvider,
    "providerDefaults",
    ()=>providerDefaults,
    "saveDefaultModelConfig",
    ()=>saveDefaultModelConfig,
    "supportedModelProviders",
    ()=>supportedModelProviders
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$security$2f$modelConfigCrypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/security/modelConfigCrypto.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db/client.ts [app-route] (ecmascript)");
;
;
const supportedModelProviders = [
    "mock",
    "deepseek",
    "openai",
    "qwen",
    "kimi",
    "custom"
];
const providerDefaults = {
    mock: {
        baseUrl: "",
        model: "mock",
        requiresKey: false
    },
    openai: {
        baseUrl: "https://api.openai.com/v1",
        model: "gpt-4o-mini",
        requiresKey: true
    },
    deepseek: {
        baseUrl: "https://api.deepseek.com",
        model: "deepseek-chat",
        requiresKey: true
    },
    qwen: {
        baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
        model: "qwen-plus",
        requiresKey: true
    },
    kimi: {
        baseUrl: "https://api.moonshot.cn/v1",
        model: "moonshot-v1-8k",
        requiresKey: true
    },
    custom: {
        baseUrl: "",
        model: "",
        requiresKey: true
    }
};
async function getSafeDefaultModelConfig(userId) {
    const config = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userModelConfig.findFirst({
        where: {
            userId,
            isDefault: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
    return config ? toSafeModelConfig(config) : null;
}
async function getDecryptedDefaultModelConfig(userId) {
    const config = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userModelConfig.findFirst({
        where: {
            userId,
            isDefault: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
    if (!config) return null;
    const provider = normalizeProvider(config.provider);
    const apiKey = config.apiKeyEncrypted ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$security$2f$modelConfigCrypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decryptModelApiKey"])(config.apiKeyEncrypted) : undefined;
    const defaults = providerDefaults[provider];
    if (provider !== "mock" && defaults.requiresKey && !apiKey) return null;
    if (provider === "custom" && !config.baseUrl) return null;
    return {
        provider,
        model: config.model || defaults.model,
        baseUrl: config.baseUrl || defaults.baseUrl,
        apiKey
    };
}
async function saveDefaultModelConfig(input) {
    const provider = normalizeProvider(input.provider);
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].userModelConfig.findFirst({
        where: {
            userId: input.userId,
            isDefault: true
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
    const defaults = providerDefaults[provider];
    const model = (input.model || defaults.model || provider).trim();
    const baseUrl = normalizeBaseUrl(input.baseUrl || defaults.baseUrl);
    const apiKeyEncrypted = input.apiKey?.trim() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$security$2f$modelConfigCrypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["encryptModelApiKey"])(input.apiKey.trim()) : existing?.apiKeyEncrypted;
    if (provider !== "mock" && provider !== "custom" && !model) {
        throw new Error("Model name is required.");
    }
    if (provider === "custom" && !baseUrl) {
        throw new Error("Base URL is required for custom OpenAI-compatible providers.");
    }
    if (provider !== "mock" && !apiKeyEncrypted) {
        throw new Error("API Key is required for this provider.");
    }
    const config = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(async (tx)=>{
        await tx.userModelConfig.updateMany({
            where: {
                userId: input.userId,
                isDefault: true
            },
            data: {
                isDefault: false
            }
        });
        if (existing) {
            return tx.userModelConfig.update({
                where: {
                    id: existing.id
                },
                data: {
                    provider,
                    model,
                    baseUrl,
                    apiKeyEncrypted: provider === "mock" ? null : apiKeyEncrypted,
                    isDefault: true
                }
            });
        }
        return tx.userModelConfig.create({
            data: {
                userId: input.userId,
                provider,
                model,
                baseUrl,
                apiKeyEncrypted: provider === "mock" ? null : apiKeyEncrypted,
                isDefault: true
            }
        });
    });
    return toSafeModelConfig(config);
}
function maskApiKey(apiKey) {
    if (!apiKey) return null;
    if (apiKey.length <= 8) return "****";
    return `${apiKey.slice(0, 3)}****${apiKey.slice(-4)}`;
}
function normalizeProvider(provider) {
    const normalized = provider.toLowerCase().trim();
    if (supportedModelProviders.includes(normalized)) {
        return normalized;
    }
    return "mock";
}
function toSafeModelConfig(config) {
    let maskedKey = null;
    if (config.apiKeyEncrypted) {
        try {
            maskedKey = maskApiKey((0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$security$2f$modelConfigCrypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decryptModelApiKey"])(config.apiKeyEncrypted));
        } catch  {
            maskedKey = "****";
        }
    }
    return {
        id: config.id,
        provider: normalizeProvider(config.provider),
        model: config.model,
        baseUrl: config.baseUrl,
        maskedKey,
        isDefault: config.isDefault,
        createdAt: config.createdAt.toISOString(),
        updatedAt: config.updatedAt.toISOString(),
        warning: (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$security$2f$modelConfigCrypto$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getModelConfigSecretWarning"])()
    };
}
function normalizeBaseUrl(baseUrl) {
    const value = baseUrl?.trim();
    return value ? value.replace(/\/$/, "") : null;
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
    ()=>isMockProvider,
    "streamJsonWithDeltas",
    ()=>streamJsonWithDeltas,
    "testChatCompletion",
    ()=>testChatCompletion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/auth/getCurrentUser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$modelConfigs$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db/modelConfigs.ts [app-route] (ecmascript)");
;
;
function getEnvProviderConfig() {
    const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();
    const defaults = __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$modelConfigs$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["providerDefaults"][provider] ?? __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$modelConfigs$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["providerDefaults"].openai;
    return {
        provider,
        apiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.QWEN_API_KEY || process.env.KIMI_API_KEY,
        baseUrl: process.env.AI_BASE_URL || defaults.baseUrl,
        model: process.env.AI_MODEL || defaults.model
    };
}
function isMockConfig(config) {
    return !config || config.provider === "mock" || !config.apiKey;
}
async function isMockProvider() {
    const configs = await getProviderCandidates();
    return configs.every((config)=>isMockConfig(config));
}
async function chatCompletion(messages, options = {}) {
    const configs = await getProviderCandidates();
    let lastError = null;
    for (const config of configs){
        if (isMockConfig(config)) continue;
        try {
            return await callChatCompletion(config, messages, options);
        } catch (error) {
            lastError = error instanceof Error ? error : new Error("AI request failed.");
        }
    }
    if (lastError) {
        throw lastError;
    }
    throw new Error("AI provider is mock or API key is missing.");
}
async function testChatCompletion(config) {
    if (isMockConfig(config)) {
        throw new Error("AI provider is mock or API key is missing.");
    }
    return callChatCompletion(config, [
        {
            role: "system",
            content: "You are a connection test assistant. Reply with plain text only."
        },
        {
            role: "user",
            content: "Reply with ok."
        }
    ], {
        temperature: 0
    });
}
async function callChatCompletion(config, messages, options = {}) {
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
    const configs = await getProviderCandidates();
    for (const config of configs){
        if (isMockConfig(config)) continue;
        try {
            const content = await callChatCompletion(config, messages, {
                responseFormat: "json",
                temperature: 0.2
            });
            return parseJsonContent(content);
        } catch  {
            continue;
        }
    }
    return mockValue;
}
async function streamJsonWithDeltas(messages, mockValue, options) {
    const configs = await getProviderCandidates();
    for (const config of configs){
        if (isMockConfig(config)) continue;
        try {
            let fullText = "";
            let emittedLength = 0;
            for await (const chunk of callStreamingChatCompletion(config, messages, {
                responseFormat: "json",
                temperature: 0.2
            })){
                fullText += chunk;
                const displayText = extractJsonStringValue(fullText, String(options.displayKey));
                if (displayText.length > emittedLength) {
                    const delta = displayText.slice(emittedLength);
                    emittedLength = displayText.length;
                    await options.onDelta(delta);
                }
            }
            const result = parseJsonContent(fullText);
            const finalDisplay = String(result[options.displayKey] || "");
            if (finalDisplay.length > emittedLength) {
                await options.onDelta(finalDisplay.slice(emittedLength));
            }
            return result;
        } catch  {
            continue;
        }
    }
    await streamMockDisplay(String(mockValue[options.displayKey] || ""), options.onDelta);
    return mockValue;
}
async function getProviderCandidates() {
    const candidates = [];
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        const userConfig = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$modelConfigs$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDecryptedDefaultModelConfig"])(user.id);
        if (userConfig) candidates.push(userConfig);
    } catch  {
    // If user config cannot be resolved or decrypted, continue to env fallback.
    }
    candidates.push(getEnvProviderConfig());
    candidates.push({
        provider: "mock",
        model: "mock",
        baseUrl: ""
    });
    return candidates;
}
async function* callStreamingChatCompletion(config, messages, options = {}) {
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
            stream: true,
            response_format: options.responseFormat === "json" ? {
                type: "json_object"
            } : undefined
        })
    });
    if (!response.ok || !response.body) {
        const text = await response.text().catch(()=>"");
        throw new Error(`AI stream failed: ${response.status} ${text.slice(0, 500)}`);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while(true){
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, {
            stream: true
        });
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() || "";
        for (const line of lines){
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") return;
            const parsed = JSON.parse(data);
            const content = parsed?.choices?.[0]?.delta?.content;
            if (typeof content === "string" && content) {
                yield content;
            }
        }
    }
}
async function streamMockDisplay(text, onDelta) {
    const parts = text.match(/.{1,3}/gs) || [];
    for (const part of parts){
        await onDelta(part);
        await new Promise((resolve)=>setTimeout(resolve, 28));
    }
}
function extractJsonStringValue(jsonText, key) {
    const keyPattern = `"${key}"`;
    const keyIndex = jsonText.indexOf(keyPattern);
    if (keyIndex < 0) return "";
    const colonIndex = jsonText.indexOf(":", keyIndex + keyPattern.length);
    if (colonIndex < 0) return "";
    let cursor = colonIndex + 1;
    while(cursor < jsonText.length && /\s/.test(jsonText[cursor]))cursor += 1;
    if (jsonText[cursor] !== '"') return "";
    cursor += 1;
    let value = "";
    let escaping = false;
    for(; cursor < jsonText.length; cursor += 1){
        const char = jsonText[cursor];
        if (escaping) {
            value += unescapeJsonChar(char);
            escaping = false;
            continue;
        }
        if (char === "\\") {
            escaping = true;
            continue;
        }
        if (char === '"') break;
        value += char;
    }
    return value;
}
function unescapeJsonChar(char) {
    if (char === "n") return "\n";
    if (char === "r") return "\r";
    if (char === "t") return "\t";
    if (char === "b") return "\b";
    if (char === "f") return "\f";
    return char;
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
    ()=>createInterviewTurn,
    "createInterviewTurnStream",
    ()=>createInterviewTurnStream
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/ai/providers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/ai/prompts.ts [app-route] (ecmascript)");
;
;
async function createInterviewTurn(input) {
    const { normalized, mock } = buildInterviewContext(input);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateJson"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildInterviewPrompt"])(normalized), mock);
}
async function createInterviewTurnStream(input, onDelta) {
    const { normalized, mock } = buildInterviewContext(input);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamJsonWithDeltas"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildInterviewPrompt"])(normalized), mock, {
        displayKey: "nextQuestion",
        onDelta
    });
}
function buildInterviewContext(input) {
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
    return {
        normalized,
        mock
    };
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
        if (body.stream) {
            return createStreamingResponse(body, user.id);
        }
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
function createStreamingResponse(body, userId) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start (controller) {
            const write = (event)=>{
                controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
            };
            try {
                let emittedText = "";
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$services$2f$interview$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createInterviewTurnStream"])(body, (text)=>{
                    emittedText += text;
                    write({
                        type: "delta",
                        text
                    });
                });
                const persistenceInput = {
                    userId,
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
                if (!emittedText && result.nextQuestion) {
                    write({
                        type: "delta",
                        text: result.nextQuestion
                    });
                }
                write({
                    type: "done",
                    result: {
                        ...result,
                        sessionId: saved.sessionId
                    }
                });
                controller.close();
            } catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                write({
                    type: "error",
                    error: message
                });
                controller.close();
            }
        }
    });
    return new Response(stream, {
        headers: {
            "Content-Type": "application/x-ndjson; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive"
        }
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__07p_f3v._.js.map