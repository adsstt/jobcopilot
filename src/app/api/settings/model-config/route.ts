import { NextRequest, NextResponse } from "next/server";
import { buildApiErrorResponse, createRequestId } from "../../../../../server/apiErrors";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { getSafeDefaultModelConfig, saveDefaultModelConfig } from "../../../../../server/db/modelConfigs";

export const runtime = "nodejs";

const route = "/api/settings/model-config";

export async function GET(request: Request) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const config = await getSafeDefaultModelConfig(user.id);
    return NextResponse.json({ config }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "当前数据加载失败，请稍后重试",
      errorCode: "MODEL_CONFIG_LOAD_FAILED",
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request);

  try {
    const user = await getCurrentUser();
    const body = await request.json().catch(() => ({}));
    const config = await saveDefaultModelConfig({
      userId: user.id,
      provider: body.provider || "mock",
      model: body.model || "",
      baseUrl: body.baseUrl || "",
      apiKey: body.apiKey || "",
    });

    return NextResponse.json({ config }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "当前保存失败，请稍后重试",
      errorCode: "MODEL_CONFIG_SAVE_FAILED",
      status: 400,
    });
  }
}
