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
"[project]/src/app/api/interview/sessions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/auth/getCurrentUser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$aiSessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db/aiSessions.ts [app-route] (ecmascript)");
;
;
;
const runtime = "nodejs";
async function GET() {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        const reviews = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$aiSessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listInterviewReviews"])(user.id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            reviews
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0fk3r_~._.js.map