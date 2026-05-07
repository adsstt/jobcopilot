import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { listInterviewReviews } from "../../../../../server/db/aiSessions";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const reviews = await listInterviewReviews(user.id);
    return NextResponse.json({ reviews });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
