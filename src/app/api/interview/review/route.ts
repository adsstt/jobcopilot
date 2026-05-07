import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { generateSessionReview } from "../../../../../server/services/review";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    if (!body.sessionId) {
      return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
    }

    const user = await getCurrentUser();
    const review = await generateSessionReview(user.id, body.sessionId);
    return NextResponse.json({ review });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
