import "dotenv/config";
import express from "express";
import { handleAnalysis, handleInterviewMessage, readAnalysisInput } from "./http";
import type { InterviewMessageRequest } from "./types";

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.DEV_CORS_ORIGIN || "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "jobcopilot-api",
    provider: process.env.AI_PROVIDER || "mock",
  });
});

app.post("/api/analysis", async (req, res, next) => {
  try {
    if (!req.is("multipart/form-data")) {
      express.json({ limit: "2mb" })(req, res, async (error) => {
        if (error) return next(error);
        try {
          const result = await handleAnalysis(await readAnalysisInput(req));
          res.json(result);
        } catch (innerError) {
          next(innerError);
        }
      });
      return;
    }

    const result = await handleAnalysis(await readAnalysisInput(req));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post("/api/interview/message", express.json({ limit: "2mb" }), async (req, res, next) => {
  try {
    const result = await handleInterviewMessage((req.body || {}) as InterviewMessageRequest);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const message = error instanceof Error ? error.message : "Unknown server error";
  res.status(500).json({ error: message });
});

const server = app.listen(port, () => {
  console.log(`JobCopilot API server ready at http://127.0.0.1:${port}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Run "npm run dev:stop" and then "npm run dev".`);
    process.exit(1);
  }
  throw error;
});
