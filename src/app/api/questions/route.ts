import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";
import { listQuestions } from "../../../../server/db/questions";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const questions = await listQuestions(user.id);
    return NextResponse.json({ questions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json().catch(() => ({}));
    const questions = await listQuestions(user.id, { forceGenerate: body.action === "generate" });
    return NextResponse.json({ questions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
