import { NextRequest, NextResponse } from "next/server";
import { buildApiErrorResponse, createRequestId } from "../../../../../server/apiErrors";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { getUserPreferences, saveUserPreferences } from "../../../../../server/db/preferences";
import { updateUserProfile } from "../../../../../server/db/users";

export const runtime = "nodejs";

const route = "/api/settings/preferences";

export async function GET(request: Request) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const preferences = await getUserPreferences(user.id);
    return NextResponse.json({ user, preferences }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "偏好设置加载失败，请稍后重试",
      errorCode: "PREFERENCES_LOAD_FAILED",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const body = await request.json().catch(() => ({}));
    const [updatedUser, preferences] = await Promise.all([
      typeof body.name === "string" ? updateUserProfile(user.id, { name: body.name }) : Promise.resolve(user),
      saveUserPreferences(user.id, body.preferences || body),
    ]);

    return NextResponse.json({ user: updatedUser, preferences }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "偏好设置保存失败，请稍后重试",
      errorCode: "PREFERENCES_SAVE_FAILED",
      status: 400,
    });
  }
}
