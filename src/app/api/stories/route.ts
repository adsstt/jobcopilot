import { NextRequest, NextResponse } from "next/server";
import { badRequest, buildApiErrorResponse, createRequestId } from "../../../../server/apiErrors";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";
import { createStory, deleteStory, generateStoriesFromUserData, listStories, updateStory } from "../../../../server/db/stories";

export const runtime = "nodejs";

const route = "/api/stories";

export async function GET(request: Request) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const stories = await listStories(user.id);
    return NextResponse.json({ stories }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "当前数据加载失败，请稍后重试",
      errorCode: "STORIES_LOAD_FAILED",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const body = await request.json().catch(() => ({}));

    if (body.action === "generate") {
      const stories = await generateStoriesFromUserData(user.id);
      return NextResponse.json({ stories }, { headers: { "x-request-id": requestId } });
    }

    const story = await createStory(user.id, body);
    return NextResponse.json({ story }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "AI 生成失败，请检查模型配置或稍后再试",
      errorCode: "STORY_CREATE_FAILED",
      status: 400,
    });
  }
}

export async function PATCH(request: NextRequest) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const body = await request.json().catch(() => ({}));
    if (!body.id) {
      throw badRequest("Story id is required.", "当前保存失败，请稍后重试", "STORY_ID_REQUIRED");
    }

    const story = await updateStory(user.id, body.id, body);
    return NextResponse.json({ story }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "当前保存失败，请稍后重试",
      errorCode: "STORY_UPDATE_FAILED",
      status: 400,
    });
  }
}

export async function DELETE(request: NextRequest) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      throw badRequest("Story id is required.", "请选择要删除的故事", "STORY_ID_REQUIRED");
    }

    await deleteStory(user.id, id);
    return NextResponse.json({ ok: true }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "故事删除失败，请稍后重试",
      errorCode: "STORY_DELETE_FAILED",
      status: 400,
    });
  }
}
