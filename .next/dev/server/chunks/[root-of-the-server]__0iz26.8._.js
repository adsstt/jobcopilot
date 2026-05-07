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
"[externals]/node:fs/promises [external] (node:fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs/promises", () => require("node:fs/promises"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[externals]/domain [external] (domain, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("domain", () => require("domain"));

module.exports = mod;
}),
"[externals]/node:os [external] (node:os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:os", () => require("node:os"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:string_decoder [external] (node:string_decoder, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:string_decoder", () => require("node:string_decoder"));

module.exports = mod;
}),
"[externals]/node:stream [external] (node:stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:stream", () => require("node:stream"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/server/parsers/documentParser.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseFile",
    ()=>parseFile,
    "parseFileBuffer",
    ()=>parseFileBuffer,
    "parseMultipartUpload",
    ()=>parseMultipartUpload
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formidable$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/formidable/src/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mammoth$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mammoth/lib/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$parse$2f$dist$2f$pdf$2d$parse$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/pdf-parse/dist/pdf-parse/esm/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$parse$2f$dist$2f$pdf$2d$parse$2f$esm$2f$PDFParse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-parse/dist/pdf-parse/esm/PDFParse.js [app-route] (ecmascript)");
;
;
;
;
async function parseMultipartUpload(req) {
    const form = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formidable$2f$src$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])({
        multiples: false,
        maxFileSize: Number(process.env.MAX_UPLOAD_BYTES || 8 * 1024 * 1024)
    });
    const [rawFields, rawFiles] = await form.parse(req);
    const fields = Object.fromEntries(Object.entries(rawFields).map(([key, value])=>[
            key,
            Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "")
        ]));
    const files = {};
    for (const [key, value] of Object.entries(rawFiles)){
        const file = Array.isArray(value) ? value[0] : value;
        if (!file) continue;
        files[key] = await parseFile(file);
    }
    return {
        fields,
        files
    };
}
async function parseFile(file) {
    const buffer = await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["readFile"])(file.filepath);
    const filename = file.originalFilename || "upload";
    const mimetype = file.mimetype || guessMimeType(filename);
    const text = await extractText(buffer, mimetype, filename);
    return {
        filename,
        mimetype,
        text
    };
}
async function parseFileBuffer(buffer, mimetype, filename) {
    return {
        filename,
        mimetype: mimetype || guessMimeType(filename),
        text: await extractText(buffer, mimetype || guessMimeType(filename), filename)
    };
}
async function extractText(buffer, mimetype, filename) {
    if (mimetype.includes("pdf") || filename.toLowerCase().endsWith(".pdf")) {
        const parser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$parse$2f$dist$2f$pdf$2d$parse$2f$esm$2f$PDFParse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PDFParse"]({
            data: buffer
        });
        try {
            const result = await parser.getText();
            return result.text.trim();
        } finally{
            await parser.destroy();
        }
    }
    if (mimetype.includes("wordprocessingml") || filename.toLowerCase().endsWith(".docx")) {
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mammoth$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].extractRawText({
            buffer
        });
        return result.value.trim();
    }
    if (mimetype.startsWith("text/") || filename.toLowerCase().endsWith(".txt")) {
        return buffer.toString("utf8").trim();
    }
    if (mimetype.startsWith("image/")) {
        return "[TODO: 图片 OCR 解析暂未实现。请先粘贴图片中的文字，后续可接入 PaddleOCR、阿里云 OCR 或模型视觉 API。]";
    }
    return "[TODO: 当前文件类型暂不支持自动解析。MVP 已支持 PDF、DOCX、TXT 和纯文本输入。]";
}
function guessMimeType(filename) {
    const lower = filename.toLowerCase();
    if (lower.endsWith(".pdf")) return "application/pdf";
    if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (lower.endsWith(".txt")) return "text/plain";
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
    return "application/octet-stream";
}
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
"[project]/server/ai/prompts/analysisPrompt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ANALYSIS_PROMPT",
    ()=>ANALYSIS_PROMPT,
    "buildAnalysisPrompt",
    ()=>buildAnalysisPrompt,
    "formatAnalysisPrompt",
    ()=>formatAnalysisPrompt
]);
const ANALYSIS_PROMPT = `
# Role
你是一位精通“精准对标法”的资深职业发展顾问、简历优化专家与面试官。你擅长基于候选人简历和目标岗位 JD，分析人岗匹配度、识别能力 Gap、给出简历优化建议，并生成后续模拟面试可使用的问题策略。

# Task
请基于【候选人简历】与【目标岗位描述 JD】，生成一份结构化「人岗匹配诊断报告」。

你需要完成以下任务：
1. 解析候选人画像：教育背景、工作经历、项目经验、核心技能、量化成果。
2. 拆解岗位要求：岗位职责、硬技能、软技能、业务场景、隐性能力要求。
3. 进行人岗匹配：识别强匹配、部分匹配、明显缺失能力。
4. 识别面试风险：预测面试官可能重点追问的问题。
5. 输出简历优化建议：按“动词强化 + JD关键词嵌入 + 数据量化 + 业务场景还原”给出可落地修改方向。
6. 生成模拟面试问题：围绕能力 Gap 和岗位核心要求，生成后续面试训练可用的问题。

# Input Data
- 目标岗位描述 JD: {{jdText}}
- 候选人简历内容: {{resumeText}}

# Output Format
请严格返回 JSON，不要输出 Markdown，不要使用代码块，不要添加任何解释文字。

{
  "matchScore": 0,
  "matchLevel": "高匹配/中高匹配/中等匹配/低匹配",
  "coreSummary": "一句话总结候选人与岗位的适配度、核心优势和最大风险",

  "candidateProfile": {
    "overallProfile": "3-5句话总结候选人画像",
    "coreSkills": ["候选人简历中体现出的核心技能"],
    "keyExperiences": [
      {
        "experienceName": "项目/实习/工作经历名称",
        "role": "候选人角色",
        "actions": ["关键动作"],
        "results": ["量化或可验证成果；如未体现则写未体现"]
      }
    ],
    "potentialRisks": ["简历中可能被追问的薄弱点"]
  },

  "jdAnalysis": {
    "jobTitle": "从JD中识别出的岗位名称；无法识别则写未明确",
    "companyName": "从JD中识别出的公司名称；无法识别则写未明确",
    "coreResponsibilities": ["岗位核心职责"],
    "requiredSkills": ["JD明确要求的技能、工具、经验"],
    "implicitRequirements": ["JD隐含要求，如数据驱动、业务理解、跨部门协作、抗压等"],
    "businessScenarios": ["岗位可能涉及的业务场景"],
    "jdKeywords": ["建议在简历和面试中重点呼应的关键词"]
  },

  "capabilityAnalysis": {
    "matched": [
      {
        "jdRequirement": "JD要求",
        "resumeEvidence": "简历中的匹配证据",
        "whyMatched": "匹配原因",
        "interviewSellingPoint": "面试中可以如何表达为优势"
      }
    ],
    "partial": [
      {
        "jdRequirement": "JD要求",
        "resumeEvidence": "简历中已有但不充分的证据",
        "gap": "差距在哪里",
        "strengthenSuggestion": "建议补充的场景、动作、数据或关键词"
      }
    ],
    "missing": [
      {
        "jdRequirement": "JD要求",
        "gapDescription": "简历未体现或明显不足的地方",
        "riskLevel": "高/中/低",
        "compensationStrategy": "面试或简历中的补救策略，不能虚构经历"
      }
    ]
  },

  "cvOptimization": [
    {
      "targetExperience": "建议优化的简历经历或模块",
      "original": "简历中的原始描述片段；如果没有明确原句，则写根据当前描述可优化",
      "optimized": "优化后的描述，需嵌入JD关键词、强化动作、补充可验证结果；不得虚构经历",
      "logic": "修改逻辑，如动词强化、关键词嵌入、数据量化、业务场景还原",
      "missingInfoToAsk": "如果需要用户补充信息，写清楚要补什么数据或细节"
    }
  ],

  "interviewPreparation": {
    "focusDimensions": [
      {
        "dimension": "面试重点能力维度",
        "probability": "1-5星",
        "reason": "为什么会被考察",
        "preparationStrategy": "应该如何准备"
      }
    ],
    "likelyQuestions": [
      {
        "question": "预测的高频面试问题",
        "questionType": "项目深挖/能力验证/业务理解/动机匹配/压力风险/其他",
        "whyAsked": "面试官为什么会问",
        "answerStrategy": "建议回答思路",
        "relatedResumeEvidence": "可以引用的简历证据；如无则写需补充"
      }
    ],
    "starStrategies": [
      {
        "question": "适合用STAR回答的问题",
        "starFramework": {
          "S": "建议说明的背景",
          "T": "建议说明的任务",
          "A": "建议突出的方法和动作",
          "R": "建议补充的结果和数据"
        },
        "keyPoints": ["回答时必须交代的关键词、动作或数据"]
      }
    ],
    "reverseQuestions": [
      "建议反问面试官的问题1",
      "建议反问面试官的问题2",
      "建议反问面试官的问题3",
      "建议反问面试官的问题4",
      "建议反问面试官的问题5"
    ]
  },

  "suggestedQuestions": [
    {
      "targetGap": "对应的能力Gap或岗位核心要求",
      "question": "后续模拟面试可使用的深度追问，必须具体到项目场景、个人角色、动作方法、成果数据",
      "expectedAnswerElements": ["项目背景", "个人职责", "具体动作", "工具/方法", "量化结果"],
      "priority": "高/中/低"
    }
  ],

  "preparationAdvice": {
    "resumeRevisionChecklist": ["简历修改检查项"],
    "knowledgeToReview": ["面试前需要补充了解的业务/工具/行业知识"],
    "beforeInterview": ["面试前准备建议"]
  }
}

# Scoring Rules
- 85-100：简历中有多个强证据直接覆盖 JD 核心要求，并且有量化成果。
- 70-84：多数核心要求匹配，但部分能力深度、业务场景或数据结果证据不足。
- 55-69：有相关经验，但与岗位核心场景存在明显迁移成本。
- 55以下：核心能力、行业经验或岗位场景缺口较大。

# Constraints
- 必须 Gap 驱动，所有建议和问题都要对应 JD 与简历之间的明确差异。
- 不得虚构候选人经历、项目名称、技术细节、业务结果或量化数据。
- 如果简历未体现，只能写“未体现”或“建议补充”，不能编造。
- 简历优化建议要可落地，重点是表达重塑，而不是凭空增加经历。
- suggestedQuestions 必须包含“能力Gap + 场景化提问 + 数据/成果要求”。
- reverseQuestions 不能宽泛，要体现对岗位目标、业务流程、团队协作或成长路径的思考。
- 输出必须是合法 JSON，属性名必须严格一致。
- 全部使用中文输出。
`;
const formatAnalysisPrompt = (jdText, resumeText)=>{
    return ANALYSIS_PROMPT.replace("{{jdText}}", jdText).replace("{{resumeText}}", resumeText);
};
function buildAnalysisPrompt(input) {
    return [
        {
            role: "system",
            content: "你必须严格遵循用户提供的分析提示词，只输出合法 JSON。"
        },
        {
            role: "user",
            content: formatAnalysisPrompt(input.jdText || "未提供", input.resumeText || "未提供")
        }
    ];
}
}),
"[project]/server/services/analysis.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAnalysis",
    ()=>createAnalysis
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/ai/providers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/server/ai/prompts.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2f$analysisPrompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/ai/prompts/analysisPrompt.ts [app-route] (ecmascript)");
;
;
async function createAnalysis(input) {
    const normalized = {
        roleTrack: input.roleTrack?.trim() || "技术岗",
        resumeText: input.resumeText?.trim() || "",
        jdText: input.jdText?.trim() || ""
    };
    const mock = {
        matchScore: normalized.resumeText && normalized.jdText ? 86 : 72,
        roleTrack: normalized.roleTrack,
        summary: "你的项目经历和目标岗位有较高相关性。当前最强的是项目推进和结构化表达，最需要补强的是业务指标、决策依据和岗位语言转译。",
        strengths: [
            "有完整项目经历，适合展开 STAR 结构回答。",
            "能体现跨团队协作和主动推动能力。",
            "技术或业务实践具备可追问的细节空间。"
        ],
        weaknesses: [
            "简历中量化指标偏少，容易被追问业务价值。",
            "部分经历偏执行描述，需要补充决策和取舍过程。",
            "目标岗位语言还不够聚焦，需要把经历转译成岗位能力。"
        ],
        predictedQuestions: [
            "请讲一个最能代表你岗位能力的项目，并说明你具体负责了什么。",
            "这个项目最终带来了哪些可量化结果？",
            "如果当时资源不足，你是如何做优先级取舍的？",
            "你在这个项目里遇到的最大分歧是什么，最后如何推动达成一致？",
            "如果重做一次，你会改进哪个环节？"
        ],
        trainingPlan: [
            {
                title: "补充业务指标",
                reason: "把项目结果从“做了什么”升级为“产生了什么价值”。"
            },
            {
                title: "准备压力追问",
                reason: "针对短板、失败和取舍问题提前组织回答。"
            },
            {
                title: "沉淀故事库",
                reason: "把高频项目改写成不同岗位方向的表达版本。"
            }
        ]
    };
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateJson"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2f$analysisPrompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildAnalysisPrompt"])(normalized), mock);
    return normalizeAnalysisResult(result, normalized.roleTrack, mock);
}
function normalizeAnalysisResult(result, roleTrack, fallback) {
    const capabilityAnalysis = result.capabilityAnalysis || {};
    const interviewPreparation = result.interviewPreparation || {};
    const strengths = arrayOrFallback(result.strengths, capabilityAnalysis.matched?.map((item)=>item.interviewSellingPoint || item.whyMatched || item.resumeEvidence), result.candidateProfile?.coreSkills, fallback.strengths);
    const weaknesses = arrayOrFallback(result.weaknesses, capabilityAnalysis.missing?.map((item)=>item.gapDescription || item.jdRequirement), capabilityAnalysis.partial?.map((item)=>item.gap || item.jdRequirement), result.candidateProfile?.potentialRisks, fallback.weaknesses);
    const predictedQuestions = arrayOrFallback(result.predictedQuestions, interviewPreparation.likelyQuestions?.map((item)=>item.question), result.suggestedQuestions?.map((item)=>item.question), fallback.predictedQuestions);
    const trainingPlan = Array.isArray(result.trainingPlan) && result.trainingPlan.length ? result.trainingPlan : Array.isArray(result.preparationAdvice?.beforeInterview) ? result.preparationAdvice.beforeInterview.slice(0, 4).map((item)=>({
            title: item,
            reason: "面试前准备建议"
        })) : fallback.trainingPlan;
    return {
        ...result,
        matchScore: Number.isFinite(Number(result.matchScore)) ? Number(result.matchScore) : fallback.matchScore,
        roleTrack: result.roleTrack || roleTrack,
        summary: result.summary || result.coreSummary || fallback.summary,
        strengths,
        weaknesses,
        predictedQuestions,
        trainingPlan
    };
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
}),
"[project]/src/app/api/analysis/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$parsers$2f$documentParser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/parsers/documentParser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$services$2f$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/services/analysis.ts [app-route] (ecmascript)");
;
;
;
;
;
const runtime = "nodejs";
async function POST(request) {
    try {
        const contentType = request.headers.get("content-type") || "";
        if (contentType.includes("multipart/form-data")) {
            const form = await request.formData();
            const roleTrack = String(form.get("roleTrack") || "");
            const resumeText = String(form.get("resumeText") || "");
            const jdText = String(form.get("jdText") || "");
            const resumeFile = form.get("resume");
            const jdFile = form.get("jd");
            const parsedResume = resumeFile instanceof File ? await parseBrowserFile(resumeFile) : null;
            const parsedJd = jdFile instanceof File ? await parseBrowserFile(jdFile) : null;
            const mergedResumeText = [
                resumeText,
                parsedResume?.text
            ].filter(Boolean).join("\n\n");
            const mergedJdText = [
                jdText,
                parsedJd?.text
            ].filter(Boolean).join("\n\n");
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$services$2f$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAnalysis"])({
                roleTrack,
                resumeText: mergedResumeText,
                jdText: mergedJdText
            });
            const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$aiSessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSessionWithAnalysis"])({
                userId: user.id,
                roleTrack: result.roleTrack,
                resumeText,
                jdText: mergedJdText,
                resumeFile: parsedResume,
                analysis: result
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                ...result,
                sessionId: session.id
            });
        }
        const body = await request.json().catch(()=>({}));
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$services$2f$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAnalysis"])(body);
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$aiSessions$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSessionWithAnalysis"])({
            userId: user.id,
            roleTrack: result.roleTrack,
            resumeText: body.resumeText || "",
            jdText: body.jdText || "",
            analysis: result
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...result,
            sessionId: session.id
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
async function parseBrowserFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$parsers$2f$documentParser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseFileBuffer"])(Buffer.from(arrayBuffer), file.type, file.name);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0iz26.8._.js.map