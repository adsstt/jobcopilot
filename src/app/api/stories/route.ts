import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";
import { createStory, generateStoriesFromUserData, listStories, updateStory } from "../../../../server/db/stories";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const stories = await listStories(user.id);
    return NextResponse.json({ stories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json().catch(() => ({}));

    if (body.action === "generate") {
      const stories = await generateStoriesFromUserData(user.id);
      return NextResponse.json({ stories });
    }

    const story = await createStory(user.id, body);
    return NextResponse.json({ story });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await request.json().catch(() => ({}));
    if (!body.id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const story = await updateStory(user.id, body.id, body);
    return NextResponse.json({ story });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
