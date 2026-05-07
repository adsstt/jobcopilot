import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "jobcopilot-api",
    provider: process.env.AI_PROVIDER || "mock",
  });
}
