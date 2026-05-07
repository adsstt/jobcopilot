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
"[project]/server/ai/prompts.ts [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
;
;
;
;
}),
"[project]/server/ai/prompts/storyPrompt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildStoryExtractionPrompt",
    ()=>buildStoryExtractionPrompt
]);
function buildStoryExtractionPrompt(input) {
    return [
        {
            role: "system",
            content: "你是面试故事库结构化助手。你只输出合法 JSON，不输出 Markdown。请从候选人的简历、面试消息和复盘中提取可长期复用的 STAR 项目故事。不得虚构经历、项目、数据或结果；如果材料没有体现，只能写“未体现，建议补充”。"
        },
        {
            role: "user",
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
`
        }
    ];
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
"[project]/server/db/stories.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStory",
    ()=>createStory,
    "generateStoriesFromUserData",
    ()=>generateStoriesFromUserData,
    "listStories",
    ()=>listStories,
    "updateStory",
    ()=>updateStory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/server/ai/prompts.ts [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2f$storyPrompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/ai/prompts/storyPrompt.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/ai/providers.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db/client.ts [app-route] (ecmascript)");
;
;
;
async function listStories(userId) {
    let stories = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].story.findMany({
        where: {
            userId
        },
        orderBy: {
            updatedAt: "desc"
        }
    });
    if (!stories.length) {
        await generateStoriesFromUserData(userId);
        stories = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].story.findMany({
            where: {
                userId
            },
            orderBy: {
                updatedAt: "desc"
            }
        });
    }
    return stories.map(toStoryCard);
}
async function generateStoriesFromUserData(userId) {
    const source = await collectStorySource(userId);
    if (!hasUsefulSource(source)) return [];
    const fallbackStories = buildFallbackStories(source);
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$providers$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateJson"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$ai$2f$prompts$2f$storyPrompt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildStoryExtractionPrompt"])(source), {
        stories: fallbackStories
    });
    const stories = normalizeGeneratedStories(result.stories, fallbackStories);
    if (!stories.length) return [];
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].story.findMany({
        where: {
            userId
        },
        select: {
            title: true
        }
    });
    const existingTitles = new Set(existing.map((story)=>normalizeTitle(story.title)));
    const uniqueStories = stories.filter((story)=>!existingTitles.has(normalizeTitle(story.title)));
    if (!uniqueStories.length) return [];
    const created = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].$transaction(uniqueStories.map((story)=>__TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].story.create({
            data: toCreateInput(userId, story)
        })));
    return created.map(toStoryCard);
}
async function createStory(userId, input) {
    const story = normalizeStoryInput(input);
    const created = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].story.create({
        data: toCreateInput(userId, story)
    });
    return toStoryCard(created);
}
async function updateStory(userId, id, input) {
    const existing = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].story.findFirst({
        where: {
            id,
            userId
        }
    });
    if (!existing) throw new Error("Story not found.");
    const current = toStoryCard(existing);
    const merged = normalizeStoryInput({
        ...current,
        ...input
    });
    const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].story.update({
        where: {
            id
        },
        data: toUpdateInput(merged)
    });
    return toStoryCard(updated);
}
async function collectStorySource(userId) {
    const [resumes, messages, reviews] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].resume.findMany({
            where: {
                userId
            },
            orderBy: {
                updatedAt: "desc"
            },
            take: 5,
            select: {
                title: true,
                rawText: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].interviewMessage.findMany({
            where: {
                session: {
                    userId
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 30,
            select: {
                role: true,
                content: true,
                evaluation: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].review.findMany({
            where: {
                userId
            },
            orderBy: {
                updatedAt: "desc"
            },
            take: 5,
            select: {
                summary: true,
                strengths: true,
                improvements: true
            }
        })
    ]);
    const improvedAnswers = [
        ...messages.flatMap((message)=>extractMessageImprovedAnswer(message.evaluation)),
        ...reviews.flatMap((review)=>extractReviewImprovedAnswers(review.improvements))
    ];
    return {
        resumes: resumes.map((resume)=>`【${resume.title}】\n${resume.rawText}`).join("\n\n").slice(0, 8000),
        interviewMessages: messages.slice().reverse().map((message)=>`${message.role}: ${message.content}`).join("\n").slice(0, 10000),
        improvedAnswers: improvedAnswers.join("\n\n").slice(0, 8000),
        fullReviews: reviews.map((review)=>JSON.stringify(review.improvements || review.summary)).join("\n\n").slice(0, 10000)
    };
}
function extractMessageImprovedAnswer(value) {
    if (!value || typeof value !== "object") return [];
    const rewritten = value.rewrittenAnswer;
    return typeof rewritten === "string" && rewritten.trim() ? [
        rewritten.trim()
    ] : [];
}
function extractReviewImprovedAnswers(value) {
    const fullReview = value && typeof value === "object" ? value.fullReview : null;
    const examples = Array.isArray(fullReview?.improvedAnswerExamples) ? fullReview.improvedAnswerExamples : [];
    return examples.map((example)=>[
            example.originalQuestion,
            example.originalAnswer,
            example.improvedAnswer,
            example.whyBetter
        ].filter(Boolean).join("\n")).filter(Boolean);
}
function hasUsefulSource(source) {
    return Object.values(source).some((value)=>value.trim().length > 30);
}
function buildFallbackStories(source) {
    const text = source.improvedAnswers || source.interviewMessages || source.resumes;
    if (!text.trim()) return [];
    return [
        {
            title: "待完善的项目经历",
            background: "材料中已出现相关经历，但背景信息仍需进一步补充。",
            task: "建议明确当时负责的目标、约束和个人职责。",
            action: text.slice(0, 240),
            result: "未体现，建议补充可验证的业务结果、效率提升或质量指标。",
            relatedSkill: "项目表达",
            relatedJDKeywords: [
                "项目深挖",
                "STAR",
                "量化结果"
            ],
            confidenceScore: 55,
            isHighFrequency: true,
            source: "mixed"
        }
    ];
}
function normalizeGeneratedStories(stories, fallback) {
    const list = Array.isArray(stories) ? stories : fallback;
    return list.map((story)=>normalizeStoryInput(story)).filter((story)=>story.title).slice(0, 5);
}
function normalizeStoryInput(input) {
    return {
        title: stringOrFallback(input.title, "未命名项目故事"),
        background: stringOrFallback(input.background, "未体现，建议补充项目背景。"),
        task: stringOrFallback(input.task, "未体现，建议补充个人任务。"),
        action: stringOrFallback(input.action, "未体现，建议补充具体行动。"),
        result: stringOrFallback(input.result, "未体现，建议补充量化结果。"),
        relatedSkill: stringOrFallback(input.relatedSkill, "项目表达"),
        relatedJDKeywords: Array.isArray(input.relatedJDKeywords) ? input.relatedJDKeywords.filter(Boolean).map(String).slice(0, 8) : [],
        confidenceScore: clampScore(input.confidenceScore),
        isHighFrequency: Boolean(input.isHighFrequency),
        source: stringOrFallback(input.source, "manual")
    };
}
function toCreateInput(userId, story) {
    return {
        user: {
            connect: {
                id: userId
            }
        },
        title: story.title,
        content: JSON.stringify({
            background: story.background,
            task: story.task,
            action: story.action,
            result: story.result
        }),
        tags: buildTags(story),
        roleTracks: [
            story.relatedSkill
        ]
    };
}
function toUpdateInput(story) {
    return {
        title: story.title,
        content: JSON.stringify({
            background: story.background,
            task: story.task,
            action: story.action,
            result: story.result
        }),
        tags: buildTags(story),
        roleTracks: [
            story.relatedSkill
        ]
    };
}
function buildTags(story) {
    return {
        relatedSkill: story.relatedSkill,
        relatedJDKeywords: story.relatedJDKeywords,
        confidenceScore: story.confidenceScore,
        isHighFrequency: story.isHighFrequency,
        source: story.source
    };
}
function toStoryCard(story) {
    const content = parseJson(story.content);
    const tags = story.tags && typeof story.tags === "object" ? story.tags : {};
    const roleTracks = Array.isArray(story.roleTracks) ? story.roleTracks.map(String) : [];
    return {
        id: story.id,
        title: story.title,
        background: stringOrFallback(content.background, ""),
        task: stringOrFallback(content.task, ""),
        action: stringOrFallback(content.action, story.content),
        result: stringOrFallback(content.result, ""),
        relatedSkill: stringOrFallback(tags.relatedSkill, roleTracks[0], "项目表达"),
        relatedJDKeywords: Array.isArray(tags.relatedJDKeywords) ? tags.relatedJDKeywords.map(String) : [],
        confidenceScore: clampScore(tags.confidenceScore),
        isHighFrequency: Boolean(tags.isHighFrequency),
        source: stringOrFallback(tags.source, "manual"),
        updatedAt: story.updatedAt.toISOString()
    };
}
function parseJson(value) {
    try {
        const parsed = JSON.parse(value);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch  {
        return {};
    }
}
function stringOrFallback(...values) {
    for (const value of values){
        if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
}
function clampScore(value) {
    const score = Number(value);
    if (!Number.isFinite(score)) return 60;
    return Math.max(0, Math.min(100, Math.round(score)));
}
function normalizeTitle(title) {
    return title.trim().toLowerCase().replace(/\s+/g, "");
}
}),
"[project]/src/app/api/stories/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "PATCH",
    ()=>PATCH,
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/auth/getCurrentUser.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$stories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/server/db/stories.ts [app-route] (ecmascript)");
;
;
;
const runtime = "nodejs";
async function GET() {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        const stories = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$stories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listStories"])(user.id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            stories
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
async function POST(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        const body = await request.json().catch(()=>({}));
        if (body.action === "generate") {
            const stories = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$stories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateStoriesFromUserData"])(user.id);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                stories
            });
        }
        const story = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$stories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createStory"])(user.id, body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            story
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 400
        });
    }
}
async function PATCH(request) {
    try {
        const user = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$auth$2f$getCurrentUser$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        const body = await request.json().catch(()=>({}));
        if (!body.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "id is required"
            }, {
                status: 400
            });
        }
        const story = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$server$2f$db$2f$stories$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateStory"])(user.id, body.id, body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            story
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 400
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__07-mu~i._.js.map