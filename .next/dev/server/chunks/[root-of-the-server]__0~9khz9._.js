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
            ...extractReviewHighlights(session.review?.improvements),
            id: session.id,
            title: session.review?.title || `${session.roleTrack} 模拟面试`,
            roleTrack: session.roleTrack,
            date: session.updatedAt.toISOString(),
            score: session.review?.score ?? session.overallScore ?? session.matchScore ?? 0,
            rating: session.review?.rating || session.overallRating || ratingFromScore(session.overallScore || session.matchScore || 0),
            focus: session.review?.summary || session.reviewSummary || "已完成分析，等待继续模拟面试。",
            tags: [
                session.roleTrack,
                extractReviewHighlights(session.review?.improvements).nextTrainingFocus?.[0] || session.lastTestedSkill || session.messages[0]?.testedSkill || "人岗匹配分析",
                session.status === "review_ready" ? "已生成复盘" : "已保存进度"
            ],
            matchScore: session.matchScore,
            status: session.status
        }));
}
function extractReviewHighlights(value) {
    if (!value || typeof value !== "object") return {};
    const fullReview = value.fullReview;
    if (!fullReview || typeof fullReview !== "object") return {};
    return {
        weaknesses: Array.isArray(fullReview.weaknesses) ? fullReview.weaknesses : [],
        nextTrainingFocus: Array.isArray(fullReview.nextTrainingFocus) ? fullReview.nextTrainingFocus : []
    };
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
"[project]/server/ai/prompts.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
}),
"[project]/server/ai/prompts/interviewPrompt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildInterviewPrompt",
    ()=>buildInterviewPrompt
]);
function buildInterviewPrompt(input) {
    const history = input.history.map((turn, index)=>`${index + 1}. ${turn.role === "ai" ? "AI 面试官" : "候选人"}：${turn.content}`).join("\n");
    const previousAiQuestions = input.history.filter((turn)=>turn.role === "ai").map((turn)=>turn.content).join("\n");
    const roundCount = input.history.filter((turn)=>turn.role === "user").length;
    return [
        {
            role: "system",
            content: "你是真实面试流程驱动的 AI 面试官兼面试教练。你必须严格按 opening -> formal -> closing -> review 状态机推进面试，并且只输出合法 JSON。"
        },
        {
            role: "user",
            content: `
# Interview Flow Control

你正在主持一场模拟面试，必须严格按阶段推进：
opening（自我介绍） -> formal（正式问答） -> closing（反问环节） -> review（结束复盘）

当前上下文：
- 岗位方向：${input.roleTrack}
- 面试类型 interviewType：${input.interviewType || "业务面"}
- 已完成候选人回答轮次：${roundCount}
- 候选人上一轮回答：${input.answer || "候选人尚未回答，这是第一轮。"}

候选人简历：
${input.resumeText || "未提供"}

目标岗位 JD：
${input.jdText || "未提供"}

analysisResult：
${JSON.stringify(input.analysis || {})}

previousMessages：
${history || "暂无"}

previousAiQuestions（避免重复提问）：
${previousAiQuestions || "暂无"}

==================================================
一、面试流程状态机
==================================================

1. opening（开场阶段）
- 仅在第 1 轮触发。
- 如果 previousMessages 为空，currentStage 必须是 opening。
- opening 第一轮必须优先要求用户进行自我介绍。
- 不允许第一轮直接深挖项目、技术细节或业务指标。
- 用户完成自我介绍后，下一轮才能进入 formal。

opening 重点考察：
- 表达逻辑
- 岗位相关性
- 是否突出核心经历
- 是否有量化成果
- 是否只是复读简历

如果用户自我介绍太长、太短、缺少岗位相关性、缺少数据、没有个人亮点，必须在 feedback 和 improvement 中指出并给优化建议。

2. formal（正式问答阶段）
- 核心面试阶段。
- 每次只能问 1 个问题。
- 必须基于 resumeText、jdText、analysisResult、previousMessages、用户上一轮回答。
- 优先围绕 analysisResult 中的 capabilityAnalysis.matched、capabilityAnalysis.partial、capabilityAnalysis.missing、suggestedQuestions、interviewPreparation.likelyQuestions、interviewPreparation.starStrategies、JD 核心要求。
- 问题必须具体、场景化、可验证、与岗位强相关。
- 禁止泛泛提问、与 JD 无关、连续重复、一次问多个问题。
- 如果用户回答太空泛、没有数据、没体现个人角色、没说明具体动作，必须追问项目背景、个人职责、方法、工具、结果或数据变化。

3. 按 interviewType 调整风格
- HR面：重点考察稳定性、动机、职业规划、沟通、抗压、团队协作。
- 业务面：重点考察项目落地、数据分析、用户/业务理解、执行能力、跨部门协作。
- 技术面：重点考察技术细节、工具方法、架构、问题解决。
- 终面：重点考察行业理解、战略思考、成长潜力、长期匹配。
- 未提供时默认业务面。

4. closing（反问阶段）
满足以下任一条件时进入 closing：
- 用户主动说结束、收尾、没有问题了。
- 面试轮次达到合理长度（通常 5 轮及以上）。
- 核心能力已覆盖。
- 当前问题已经收尾。

进入 closing 后：
- 禁止继续正式提问。
- 必须引导用户向面试官反问。
- 提供反问方向：岗位目标、团队协作、成长路径、绩效标准、业务挑战。
- 禁止推荐低质量问题：加班吗、双休吗、工资什么时候涨。

如果用户已经提出反问问题：
- 必须评价问题质量。
- 判断是否有业务深度。
- 给出更专业优化版本。

5. review（复盘阶段）
- 仅在面试彻底结束后触发。
- review 阶段不再继续问问题，不再追问。
- 生成优势总结、待提升点、高频问题建议、STAR 优化建议。

==================================================
二、输出格式
==================================================

请严格输出 JSON，不要 Markdown，不要代码块，不要解释性文字。

{
  "currentStage": "opening/formal/closing/review",
  "shouldMoveToNextStage": false,
  "interviewType": "HR面/业务面/技术面/终面",
  "evaluation": "对用户上一轮回答的评价",
  "score": 0,
  "feedback": "指出1-2个具体问题",
  "improvement": "给出1-2条具体优化建议",
  "improvedAnswer": "基于用户真实经历优化后的示范回答，控制150字以内，不得虚构",
  "nextQuestion": "下一道问题，每次只能问一个",
  "testedSkill": "本轮考察能力",
  "followUpReason": "为什么问这个问题，必须关联JD、简历或analysisResult",
  "isClosing": false
}

==================================================
三、核心约束
==================================================

- 每次只能问一个问题。
- 必须严格按阶段推进。
- 必须有 opening 和 closing。
- opening 必须先做自我介绍。
- closing 必须进入反问环节。
- 不得虚构经历、项目名称、技术细节、业务结果或量化数据。
- 不得脱离 JD。
- 不得泛化。
- 不得连续重复。
- 必须 Gap 驱动。
- 必须 STAR 化追问。
- 必须保持 JSON 合法。
- 全部使用中文输出。

==================================================
四、阶段决策提示
==================================================

- 如果 previousMessages 为空：currentStage="opening"，nextQuestion 必须要求候选人做 1-2 分钟自我介绍，并提示围绕目标岗位、核心经历和量化成果展开。
- 如果上一轮是自我介绍且已回答：currentStage 可以转为 "formal"，shouldMoveToNextStage=true，并基于 analysisResult 选择第一个正式问题。
- formal 阶段优先使用 suggestedQuestions 中 priority="高" 的问题，或 missing/partial 中 riskLevel="高" 的 Gap。
- 如果 roundCount >= 5 且已覆盖至少 2-3 个核心能力：进入 closing。
- 如果用户在 closing 已经提出反问并表示结束：进入 review。
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
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/server/ai/prompts.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2f$interviewPrompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/ai/prompts/interviewPrompt.ts [app-route] (ecmascript)");
;
;
async function createInterviewTurn(input) {
    const { normalized, mock } = buildInterviewContext(input);
    const forced = buildForcedClosingTurn(normalized);
    if (forced) return forced;
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateJson"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2f$interviewPrompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildInterviewPrompt"])(normalized), mock);
    return enforceStageControl(normalized, normalizeInterviewResult(result, mock), mock);
}
async function createInterviewTurnStream(input, onDelta) {
    const { normalized, mock } = buildInterviewContext(input);
    const forced = buildForcedClosingTurn(normalized);
    if (forced) {
        await streamText(forced.nextQuestion, onDelta);
        return forced;
    }
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamJsonWithDeltas"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2f$interviewPrompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildInterviewPrompt"])(normalized), mock, {
        displayKey: "nextQuestion",
        onDelta
    });
    return enforceStageControl(normalized, normalizeInterviewResult(result, mock), mock);
}
function buildInterviewContext(input) {
    const normalized = {
        roleTrack: input.roleTrack?.trim() || input.analysis?.roleTrack || "技术岗",
        interviewType: input.interviewType || "业务面",
        resumeText: input.resumeText?.trim() || "",
        jdText: input.jdText?.trim() || "",
        analysis: input.analysis || defaultAnalysis(input.roleTrack || "技术岗"),
        history: input.history || [],
        answer: input.answer?.trim() || ""
    };
    const firstRound = !normalized.answer;
    const mock = {
        currentStage: firstRound ? "opening" : "formal",
        shouldMoveToNextStage: !firstRound,
        interviewType: "业务面",
        feedback: firstRound ? "第一轮应先完成自我介绍。" : "回答结构清楚，但细节和数据还可以加强。",
        improvement: firstRound ? "请围绕目标岗位、核心经历和量化成果进行 1-2 分钟介绍。" : "补充你的个人角色、关键动作、工具方法和可验证结果。",
        improvedAnswer: firstRound ? "" : "我主导 React 迁移时，先识别性能瓶颈和迁移风险，再设计新老系统共存方案，逐步替换核心链路，并用性能指标验证效果。",
        followUpReason: firstRound ? "opening 阶段必须先考察自我介绍。" : "继续验证候选人是否能用数据证明项目价值。",
        isClosing: false,
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
        nextQuestion: firstRound ? "请先做一个 1-2 分钟的自我介绍，重点说明你的目标岗位、最相关的核心经历，以及能证明你能力的量化成果。" : "你刚才提到了项目效果，请进一步说明：你们当时用哪些指标判断这个方案是成功的？",
        testedSkill: firstRound ? "项目完整表达" : "业务指标与结果验证"
    };
    return {
        normalized,
        mock
    };
}
function buildForcedClosingTurn(input) {
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
                strengths: [
                    "能够完成正式问答和反问收尾。"
                ],
                improvements: [
                    "后续复盘需要重点补强岗位相关性、量化结果和 STAR 表达。"
                ],
                rewrittenAnswer: "本次面试可以结束。建议复盘时把核心项目按 STAR 结构补齐背景、任务、行动和结果，并补充可验证数据。"
            },
            nextQuestion: "好的，本次模拟面试到这里结束。你可以点击结束按钮进入复盘，查看本次表现总结、待提升点和回答优化建议。",
            testedSkill: "面试复盘"
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
                strengths: [
                    "能主动进入反问环节，说明有面试互动意识。"
                ],
                improvements: [
                    "反问可以更聚焦岗位目标、业务挑战和评价标准。"
                ],
                rewrittenAnswer: optimizeReverseQuestion(lastAnswer)
            },
            nextQuestion: "这个反问方向可以继续打磨。你还想再补充 1 个反问问题，还是结束面试并生成本次复盘？",
            testedSkill: "反问能力"
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
            strengths: [
                "能主动表达收尾意图。"
            ],
            improvements: [
                "需要用高质量反问展示岗位理解和长期匹配度。"
            ],
            rewrittenAnswer: "我想了解这个岗位入职后前三个月最核心的目标是什么，以及团队会如何衡量这个阶段的产出质量？"
        },
        nextQuestion,
        testedSkill: "反问能力"
    };
}
function normalizeInterviewResult(result, fallback) {
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
            strengths: arrayOrFallback(legacyEvaluation?.strengths, feedback ? [
                feedback
            ] : [], fallback.evaluation.strengths),
            improvements: arrayOrFallback(legacyEvaluation?.improvements, improvement ? [
                improvement
            ] : [], fallback.evaluation.improvements),
            rewrittenAnswer: improvedAnswer
        },
        nextQuestion: stringOrFallback(result.nextQuestion, fallback.nextQuestion),
        testedSkill: stringOrFallback(result.testedSkill, fallback.testedSkill)
    };
}
function enforceStageControl(input, result, fallback) {
    const isClosingHistory = hasClosingHistorySafe(input.history);
    const userRounds = input.history.filter((turn)=>turn.role === "user").length || (input.answer ? 1 : 0);
    if (!isClosingHistory && !isEndInterviewIntentSafe(input.answer) && userRounds > 0 && userRounds < 5 && (result.currentStage === "closing" || result.currentStage === "review" || result.isClosing)) {
        const nextQuestion = buildFormalFallbackQuestion(input, result, fallback);
        return {
            ...result,
            currentStage: "formal",
            shouldMoveToNextStage: false,
            isClosing: false,
            followUpReason: "候选人尚未主动结束，且正式面试轮次不足，系统强制继续 formal 阶段并基于 JD/analysisResult 提问。",
            nextQuestion,
            testedSkill: result.testedSkill && result.testedSkill !== "反问能力" && result.testedSkill !== "面试复盘" ? result.testedSkill : "岗位核心能力验证"
        };
    }
    return result;
}
function buildFormalFallbackQuestion(input, result, fallback) {
    const analysis = input.analysis;
    const suggested = firstString(analysis?.suggestedQuestions?.map((item)=>item?.question), analysis?.interviewPreparation?.likelyQuestions?.map((item)=>item?.question), analysis?.predictedQuestions, result.nextQuestion && !result.nextQuestion.includes("反问") && !result.nextQuestion.includes("复盘") ? [
        result.nextQuestion
    ] : [], [
        fallback.nextQuestion
    ]);
    return suggested || "请结合你刚才的自我介绍，具体讲一个最能证明你匹配目标岗位的项目：当时背景是什么、你负责什么、用了什么方法、最后结果如何？";
}
function firstString(...values) {
    for (const value of values){
        if (Array.isArray(value)) {
            const found = value.find((item)=>typeof item === "string" && item.trim());
            if (found) return found.trim();
        }
    }
    return "";
}
function normalizeStage(value) {
    return value === "opening" || value === "formal" || value === "closing" || value === "review" ? value : undefined;
}
function normalizeInterviewType(value) {
    return value === "HR面" || value === "业务面" || value === "技术面" || value === "终面" ? value : undefined;
}
function stringOrFallback(...values) {
    for (const value of values){
        if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
}
function arrayOrFallback(...values) {
    for (const value of values){
        if (Array.isArray(value)) {
            const cleaned = value.filter((item)=>typeof item === "string" && item.trim()).map((item)=>item.trim());
            if (cleaned.length) return cleaned;
        }
    }
    return [];
}
function isEndInterviewIntentSafe(answer) {
    const normalized = answer.trim().toLowerCase();
    if (!normalized) return false;
    const chineseMatched = [
        "\u7ed3\u675f",
        "\u7ed3\u675f\u9762\u8bd5",
        "\u6211\u60f3\u7ed3\u675f\u9762\u8bd5",
        "\u53ef\u4ee5\u7ed3\u675f\u4e86",
        "\u6ca1\u6709\u4e86",
        "\u5148\u5230\u8fd9\u91cc"
    ].some((keyword)=>normalized.includes(keyword));
    return chineseMatched || /\b(stop|end)\b/i.test(normalized);
}
function hasClosingHistorySafe(history) {
    return history.some((turn)=>{
        if (turn.role !== "ai") return false;
        return turn.content.includes("\u73b0\u5728\u8fdb\u5165\u53cd\u95ee\u73af\u8282") || turn.content.includes("\u4f60\u53ef\u4ee5\u5411\u9762\u8bd5\u5b98\u63d0 1 \u4e2a\u95ee\u9898") || turn.content.includes("\u53cd\u95ee\u73af\u8282") || turn.content.includes("\u53cd\u95ee\u80fd\u529b");
    });
}
function isEndInterviewIntent(answer) {
    const normalized = answer.trim().toLowerCase();
    if (!normalized) return false;
    const chineseMatched = [
        "结束",
        "结束面试",
        "我想结束面试",
        "可以结束了",
        "没有了",
        "先到这里"
    ].some((keyword)=>normalized.includes(keyword.toLowerCase()));
    if (chineseMatched) return true;
    return /\b(stop|end)\b/i.test(normalized);
}
function hasClosingHistory(history) {
    return history.some((turn)=>{
        if (turn.role !== "ai") return false;
        return turn.content.includes("现在进入反问环节") || turn.content.includes("你可以向面试官提 1 个问题");
    });
}
function evaluateReverseQuestion(question) {
    if (hasBusinessDepth(question)) {
        return "这个反问具备一定业务深度，能体现你对岗位目标、团队协作或业务挑战的关注。";
    }
    return "这个反问还偏泛，可以进一步聚焦岗位目标、业务挑战、协作方式或绩效标准，让面试官感受到你的岗位理解。";
}
function optimizeReverseQuestion(question) {
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
function scoreReverseQuestion(question) {
    return hasBusinessDepth(question) ? 86 : 74;
}
function hasBusinessDepth(question) {
    return [
        "目标",
        "业务",
        "挑战",
        "团队",
        "协作",
        "成长",
        "路径",
        "绩效",
        "标准",
        "衡量",
        "产出"
    ].some((keyword)=>question.includes(keyword));
}
async function streamText(text, onDelta) {
    const parts = text.match(/.{1,4}/gs) || [];
    for (const part of parts){
        await onDelta(part);
        await new Promise((resolve)=>setTimeout(resolve, 24));
    }
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
        const interviewBody = await withPersistedHistory(body, user.id);
        if (interviewBody.stream) {
            return createStreamingResponse(interviewBody, user.id);
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$services$2f$interview$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createInterviewTurn"])(interviewBody);
        const persistenceInput = {
            userId: user.id,
            sessionId: interviewBody.sessionId,
            roleTrack: interviewBody.roleTrack || interviewBody.analysis?.roleTrack || result.testedSkill || "技术岗",
            resumeText: interviewBody.resumeText || "",
            jdText: interviewBody.jdText || "",
            analysis: interviewBody.analysis,
            nextQuestion: result.nextQuestion,
            testedSkill: result.testedSkill,
            evaluation: result.evaluation
        };
        const saved = interviewBody.answer ? await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$aiSessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveAnswerAndAiResponse"])({
            ...persistenceInput,
            answer: interviewBody.answer
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
async function withPersistedHistory(body, userId) {
    if (Array.isArray(body.history) && body.history.length > 0) return body;
    if (!body.sessionId) return body;
    const history = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$aiSessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSessionTurns"])(userId, body.sessionId);
    return {
        ...body,
        history
    };
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0~9khz9._.js.map