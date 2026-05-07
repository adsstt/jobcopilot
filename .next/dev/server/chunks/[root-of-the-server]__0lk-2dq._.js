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
"[project]/server/db/documents.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "listUserDocuments",
    ()=>listUserDocuments
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db/client.ts [app-route] (ecmascript)");
;
async function listUserDocuments(userId) {
    const [resumes, sessionsWithJd] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].resume.findMany({
            where: {
                userId
            },
            orderBy: {
                updatedAt: "desc"
            },
            take: 20,
            select: {
                id: true,
                title: true,
                fileName: true,
                mimeType: true,
                rawText: true,
                updatedAt: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interviewSession.findMany({
            where: {
                userId,
                jdText: {
                    not: ""
                }
            },
            orderBy: {
                updatedAt: "desc"
            },
            take: 20,
            select: {
                id: true,
                title: true,
                roleTrack: true,
                jdText: true,
                status: true,
                analysis: true,
                updatedAt: true
            }
        })
    ]);
    return [
        ...resumes.map((resume)=>({
                id: resume.id,
                type: "简历",
                title: cleanTitle(resume.fileName || resume.title || "简历资料"),
                track: "默认",
                status: resume.mimeType ? "已上传" : "文本",
                updated: resume.updatedAt.toISOString(),
                size: formatTextSize(resume.rawText)
            })),
        ...sessionsWithJd.map((session)=>({
                id: session.id,
                type: "JD",
                title: buildJdTitle(session),
                track: cleanTitle(session.roleTrack || "岗位方向"),
                status: session.status === "analyzed" ? "已分析" : "已关联",
                updated: session.updatedAt.toISOString(),
                size: formatTextSize(session.jdText)
            }))
    ].sort((left, right)=>new Date(right.updated).getTime() - new Date(left.updated).getTime());
}
function buildJdTitle(session) {
    const jdAnalysis = session.analysis?.jdAnalysis;
    const companyName = cleanTitle(jdAnalysis?.companyName || "");
    const jobTitle = cleanTitle(jdAnalysis?.jobTitle || "");
    if (jobTitle && companyName && companyName !== "未明确") return `${companyName} · ${jobTitle} JD`;
    if (jobTitle && jobTitle !== "未明确") return `${jobTitle} JD`;
    return `${cleanTitle(session.roleTrack || session.title || "目标岗位")} JD`;
}
function cleanTitle(value) {
    return value.replace(/\?\?/g, "").replace(/\b(deepseek|frontend|unicode|verify|restart|final|fix)-\d+\b/gi, "").replace(/\bdeepseek-(final|fix|restart)?-?\d+\b/gi, "").replace(/\s+/g, " ").replace(/[-_ ]+$/g, "").trim();
}
function formatTextSize(text) {
    const bytes = Buffer.byteLength(text || "", "utf8");
    if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    if (bytes >= 1024) return `${Math.ceil(bytes / 1024)} KB`;
    return bytes ? `${bytes} B` : "文本";
}
}),
"[project]/src/app/api/documents/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/auth/getCurrentUser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$documents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db/documents.ts [app-route] (ecmascript)");
;
;
;
const runtime = "nodejs";
async function GET() {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        const documents = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$documents$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listUserDocuments"])(user.id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            documents
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0lk-2dq._.js.map