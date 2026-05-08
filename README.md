# JobCopilot

JobCopilot 是一个面向求职训练场景的 AI 面试助手。它围绕简历、JD、模拟问答、复盘、故事沉淀和题库整理，帮助用户建立自己的长期面试准备工作台。

当前项目已接入正式的 Supabase Auth 登录体系，采用“邮箱密码注册 + 邮箱确认”方案。用户完成邮箱确认后才能首次登录，业务数据通过 Supabase Auth 用户 ID + Prisma `userId` 查询实现隔离。

## 功能说明

- 简历与 JD 匹配分析
- 模拟面试与流式追问
- 面试记录、复盘、故事库、题库
- 用户级模型配置保存
- 邮箱密码注册、登录、退出登录
- 邮箱确认、重发确认邮件、忘记密码、重置密码

## 技术栈

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase Auth
- Supabase Postgres
- Prisma ORM
- DeepSeek / OpenAI 兼容模型接口
- Vercel

## 本地运行

1. 安装依赖

```bash
npm install
```

2. 复制环境变量

```bash
cp .env.example .env.local
```

3. 至少配置以下变量

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `MODEL_CONFIG_SECRET`
- `APP_URL`
- 默认 AI provider 与对应 key

4. 生成 Prisma Client 并同步数据库结构

```bash
npm run db:generate
npm run db:push
```

5. 启动开发环境

```bash
npm run dev
```

访问 `http://localhost:3000`。

## 环境变量

### 必填

- `DATABASE_URL`
  - Prisma 连接 Supabase Postgres 使用
  - Vercel Serverless 建议使用 Supabase pooled connection

- `NEXT_PUBLIC_SUPABASE_URL`
  - Supabase 项目地址

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - Supabase 前端匿名 key

- `MODEL_CONFIG_SECRET`
  - 用户保存模型 API Key 时的加密密钥

- `AI_PROVIDER`
  - 默认模型提供方，支持 `mock` / `openai` / `deepseek` / `qwen` / `kimi` / `custom`

- 默认 AI key
  - `AI_API_KEY` 或 provider 对应 key，例如 `DEEPSEEK_API_KEY`

- `APP_URL`
  - 当前站点访问地址
  - 本地可为 `http://localhost:3000`
  - 生产环境请填写正式 Vercel 域名

### 可选

- `SUPABASE_SERVICE_ROLE_KEY`
  - 本阶段登录主链路不依赖它
  - 如果后续需要服务端管理型 Auth 操作、webhook 或后台任务，可以保留

- `NEXT_PUBLIC_APP_URL`
  - 可作为前端显式回跳地址，建议与 `APP_URL` 保持一致

- `AI_MODEL`
- `AI_BASE_URL`
- `MAX_UPLOAD_BYTES`
- `API_PORT`
- `DEV_CORS_ORIGIN`

## Supabase 后台配置

在 `Authentication -> URL Configuration` 中配置：

### Site URL

- 本地开发：`http://localhost:3000`
- 生产环境：你的正式 Vercel 域名，例如 `https://your-app.vercel.app`

### Redirect URLs

- `http://localhost:3000/auth/callback`
- `http://localhost:3000/reset-password`
- `https://your-app.vercel.app/auth/callback`
- `https://your-app.vercel.app/reset-password`

如果你希望 Preview Deployment 也能测试邮件确认与重置密码，再额外加入对应 preview 域名白名单。

## Vercel 部署步骤

1. 将项目推送到 GitHub
2. 在 Vercel 中导入仓库
3. Framework Preset 选择 `Next.js`
4. 在 Vercel 环境变量中配置 README 上述必填项
5. 在 Supabase 后台完成 `Site URL` 与 `Redirect URLs` 配置
6. 在部署前或 CI 中执行数据库迁移

```bash
npx prisma migrate deploy
```

7. 完成部署后访问 `/api/health` 验证服务可用

## Vercel 兼容性说明

### 1. Next.js / Supabase SSR

- 当前项目基于 Next.js 16，已使用 `proxy.ts`，没有继续使用旧的 `middleware.ts`
- Supabase SSR 通过 `@supabase/ssr` 维护 cookie session
- 登录页因使用 `useSearchParams()`，已经按 Next 16 要求包裹在 `Suspense` 下，构建兼容

### 2. Prisma 与 Serverless

- 当前业务 API 全部显式声明为 `runtime = "nodejs"`
- Prisma 不适合 Edge Runtime，因此保持在 Node Runtime
- 生产 `DATABASE_URL` 建议使用 Supabase connection pooling
- 数据库迁移建议通过 `prisma migrate deploy` 在部署流程外执行，不放到请求运行时

### 3. Streaming

- `/api/interview/message` 使用 Node Runtime + `ReadableStream` + NDJSON
- 该方式兼容 Vercel Node Serverless
- 由于同一链路里还包含 Prisma 和 Node 侧逻辑，不建议迁移到 Edge Runtime

## 用户隔离说明

当前数据隔离方式：

- Supabase Auth 提供真实用户身份
- Prisma 本地 `User.id` 直接使用 Supabase `auth.users.id`
- 业务表继续使用现有 `userId` 过滤查询

重点隔离范围：

- Dashboard
- Stories
- Questions
- Reviews
- Documents
- Settings 中的模型配置

不同账号之间这些数据默认互相不可见。

## 常用脚本

```bash
npm run dev
npm run lint
npm run build
npm run start
npm run db:generate
npm run db:migrate
npm run db:push
```

## 验证状态

当前代码已通过：

```bash
npm run lint
npm run build
```
