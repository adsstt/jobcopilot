# JobCopilot

JobCopilot is an AI interview practice app for job seekers. It helps users analyze a resume against a job description, run mock interview turns, review answer quality, and collect stories/questions for later practice.

The current project is a Next.js App Router app with server-side API Route Handlers, Prisma persistence on Supabase Postgres, and OpenAI-compatible model providers such as DeepSeek.

## Features

- Resume and JD analysis with structured match feedback.
- Streaming mock interview questions and answer evaluation.
- Interview session persistence, review summaries, question bank, story library, and dashboard views.
- User model configuration with encrypted API keys.
- Local mock AI provider for development without paid model calls.

## Tech Stack

- Next.js App Router, React, TypeScript
- Tailwind CSS v4
- Prisma ORM
- Supabase Postgres
- OpenAI-compatible AI providers: DeepSeek, OpenAI, Qwen, Kimi, custom
- Vercel deployment target

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Configure at least `DATABASE_URL`, `MODEL_CONFIG_SECRET`, and the AI provider values you need. For local UI testing, `AI_PROVIDER="mock"` is enough after the database is reachable.

4. Generate the Prisma client and apply the schema:

```bash
npm run db:generate
npm run db:push
```

5. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Required for production:

- `DATABASE_URL`: Supabase Postgres connection string used by Prisma. On Vercel, prefer the Supabase pooled connection string on port `6543` to reduce serverless connection pressure.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL. Public browser-safe value.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key. Public browser-safe value.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key. Server-only secret; never expose it to client code.
- `MODEL_CONFIG_SECRET`: Long, stable secret used to encrypt saved model API keys.
- `AI_PROVIDER`: Default model provider. Use `deepseek` for the default production DeepSeek setup.
- Default AI provider key: set either `AI_API_KEY` or the provider-specific key such as `DEEPSEEK_API_KEY`.

Optional:

- `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`, `QWEN_API_KEY`, `KIMI_API_KEY`
- `AI_MODEL`
- `AI_BASE_URL`
- `MAX_UPLOAD_BYTES`
- `APP_URL`
- `DEFAULT_USER_ID`, `DEFAULT_USER_EMAIL`, `DEFAULT_USER_NAME`
- `API_PORT`, `DEV_CORS_ORIGIN` for the legacy local Express dev server only

## Vercel Compatibility Notes

- All `src/app/api/**/route.ts` files explicitly use `runtime = "nodejs"`. This is required because the server code uses Prisma, Node crypto, file parsing, and streamed fetch handling that are better suited to Node Runtime than Edge Runtime.
- Streaming interview responses use Web `ReadableStream` and newline-delimited JSON from a Node Route Handler. This is compatible with Vercel Node Serverless functions; do not move these routes to Edge while Prisma and Node crypto are in the same request path.
- Prisma Client is generated in `postinstall`, so Vercel installs dependencies and then runs `prisma generate` before `next build`.
- Serverless deployments can create many short-lived database connections. Use Supabase connection pooling for `DATABASE_URL`, keep the singleton Prisma client pattern in `server/db/client.ts`, and run migrations separately from the Vercel runtime.
- The production build command is `npm run build`; the start command for local production testing is `npm run start`. Vercel does not need a custom start command for Next.js deployments.

## Deploy To Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Keep the framework preset as Next.js.
4. Set the build command to `npm run build` or leave the Vercel default for Next.js.
5. Add all required environment variables in Vercel Project Settings.
6. Run Prisma migrations against Supabase before or during a controlled release step:

```bash
npx prisma migrate deploy
```

7. Deploy the project.
8. After deployment, open `/api/health` and confirm it returns `ok: true`.

## Scripts

- `npm run dev`: start local Next.js development server.
- `npm run lint`: run TypeScript validation.
- `npm run build`: create a production Next.js build.
- `npm run start`: run the production build locally.
- `npm run db:generate`: generate Prisma Client.
- `npm run db:migrate`: create/apply local development migrations.
- `npm run db:push`: push schema during local prototyping.

## Deployment Checklist

- `npm run lint` passes.
- `npm run build` passes.
- Vercel environment variables are configured.
- `DATABASE_URL` uses Supabase pooling for serverless runtime.
- Prisma migrations have been applied with `prisma migrate deploy`.
- API routes remain on Node Runtime.
