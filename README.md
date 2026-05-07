# JobCopilot

JobCopilot 是一个面向求职者的 AI 面试训练应用。它可以帮助用户基于简历和岗位 JD 做匹配分析，进行模拟面试，复盘回答质量，并沉淀面试故事库和题库。

当前项目采用 Next.js App Router 架构，后端能力通过 Next.js Route Handlers 提供，数据持久化使用 Prisma + Supabase Postgres，模型调用支持 DeepSeek 等 OpenAI 兼容服务。

## 功能说明

- 简历与 JD 匹配分析，输出结构化岗位适配反馈。
- 流式模拟面试，支持回答评价和下一题生成。
- 面试会话持久化、复盘总结、题库、故事库和仪表盘视图。
- 用户模型配置管理，支持加密保存模型 API Key。
- 本地 mock AI provider，方便无真实模型 Key 时开发调试。

## 技术栈

- Next.js App Router、React、TypeScript
- Tailwind CSS v4
- Prisma ORM
- Supabase Postgres
- OpenAI 兼容模型服务：DeepSeek、OpenAI、Qwen、Kimi、自定义服务
- Vercel 部署

## 本地运行

1. 安装依赖：

```bash
npm install
```

2. 复制环境变量模板：

```bash
cp .env.example .env.local
```

3. 至少配置 `DATABASE_URL`、`MODEL_CONFIG_SECRET` 和需要使用的 AI provider。仅本地调试 UI 时，可以先使用 `AI_PROVIDER="mock"`，但数据库仍需可连接。

4. 生成 Prisma Client 并同步数据库结构：

```bash
npm run db:generate
npm run db:push
```

5. 启动开发服务：

```bash
npm run dev
```

打开 `http://localhost:3000` 访问项目。

## 环境变量

生产环境必填：

- `DATABASE_URL`：Prisma 使用的 Supabase Postgres 连接字符串。部署到 Vercel 时建议使用 Supabase 连接池地址，通常为 `6543` 端口，以降低 Serverless 连接数压力。
- `NEXT_PUBLIC_SUPABASE_URL`：Supabase 项目 URL。该变量可暴露给浏览器。
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：Supabase anon key。该变量可暴露给浏览器。
- `SUPABASE_SERVICE_ROLE_KEY`：Supabase service role key。仅服务端使用，不能暴露给前端。
- `MODEL_CONFIG_SECRET`：用于加密用户保存的模型 API Key。生产环境必须设置为足够长且稳定的随机字符串。
- `AI_PROVIDER`：默认模型 provider。生产默认使用 DeepSeek 时设置为 `deepseek`。
- 默认 AI provider key：设置 `AI_API_KEY`，或设置对应 provider 的专用 Key，例如 `DEEPSEEK_API_KEY`。

可选：

- `OPENAI_API_KEY`、`DEEPSEEK_API_KEY`、`QWEN_API_KEY`、`KIMI_API_KEY`
- `AI_MODEL`
- `AI_BASE_URL`
- `MAX_UPLOAD_BYTES`
- `APP_URL`
- `DEFAULT_USER_ID`、`DEFAULT_USER_EMAIL`、`DEFAULT_USER_NAME`
- `API_PORT`、`DEV_CORS_ORIGIN`，仅旧版本地 Express 开发服务使用，Vercel 不需要

## Vercel 兼容性说明

- 所有 `src/app/api/**/route.ts` 文件都显式设置了 `runtime = "nodejs"`。这是必要的，因为服务端代码使用了 Prisma、Node crypto、文件解析和流式 fetch 处理，更适合运行在 Node Runtime，而不是 Edge Runtime。
- 模拟面试的流式响应使用 Web `ReadableStream` 和 NDJSON，由 Node Route Handler 输出。该方案兼容 Vercel Node Serverless Functions；在 Prisma 和 Node crypto 仍处于同一请求链路时，不建议迁移到 Edge Runtime。
- `postinstall` 会执行 `prisma generate`，因此 Vercel 安装依赖后会在 `next build` 前生成 Prisma Client。
- Serverless 环境可能产生较多短生命周期数据库连接。生产 `DATABASE_URL` 建议使用 Supabase connection pooling，同时保留 `server/db/client.ts` 中的 Prisma 单例模式，并将数据库迁移放在 Vercel runtime 之外执行。
- 生产构建命令为 `npm run build`；本地生产预览命令为 `npm run start`。Vercel 部署 Next.js 项目时不需要自定义 start command。

## 部署到 Vercel

1. 将项目推送到 GitHub。
2. 在 Vercel 中导入该仓库。
3. Framework Preset 保持为 Next.js。
4. Build Command 使用 `npm run build`，也可以保留 Vercel 对 Next.js 的默认配置。
5. 在 Vercel Project Settings 中配置所有生产必填环境变量。
6. 在部署前或受控发布步骤中，对 Supabase 数据库执行 Prisma 迁移：

```bash
npx prisma migrate deploy
```

7. 部署项目。
8. 部署完成后访问 `/api/health`，确认返回 `ok: true`。

## 常用脚本

- `npm run dev`：启动本地 Next.js 开发服务。
- `npm run lint`：执行 TypeScript 校验。
- `npm run build`：执行生产构建。
- `npm run start`：本地运行生产构建结果。
- `npm run db:generate`：生成 Prisma Client。
- `npm run db:migrate`：创建并应用本地开发迁移。
- `npm run db:push`：本地原型阶段同步 Prisma schema。

## 部署检查清单

- `npm run lint` 通过。
- `npm run build` 通过。
- Vercel 环境变量已配置完整。
- `DATABASE_URL` 在 Serverless runtime 中使用 Supabase 连接池地址。
- 已执行 `prisma migrate deploy` 应用数据库迁移。
- API Routes 保持 Node Runtime。
