import { NextRequest, NextResponse } from "next/server";
import { buildApiErrorResponse, createRequestId } from "../../../../../server/apiErrors";
import { testChatCompletion } from "../../../../../server/ai/providers";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { getDecryptedDefaultModelConfig, normalizeProvider, providerDefaults } from "../../../../../server/db/modelConfigs";

export const runtime = "nodejs";

const route = "/api/settings/test-model";

export async function POST(request: NextRequest) {
  const requestId = createRequestId(request);

  try {
    const body = await request.json().catch(() => ({}));
    const savedConfig = body.apiKey ? null : await getSavedConfig();
    const provider = normalizeProvider(body.provider || savedConfig?.provider || "mock");
    const defaults = providerDefaults[provider];
    const baseUrl = (body.baseUrl || savedConfig?.baseUrl || defaults.baseUrl || "").trim().replace(/\/$/, "");
    const model = (body.model || savedConfig?.model || defaults.model || provider).trim();
    const apiKey = String(body.apiKey || savedConfig?.apiKey || "").trim();

    if (provider === "mock") {
      return NextResponse.json({ ok: true, message: "Mock provider is available." }, { headers: { "x-request-id": requestId } });
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            requestId,
            errorCode: "MODEL_API_KEY_REQUIRED",
            safeMessage: "AI 生成失败，请检查模型配置或稍后再试",
            ...(process.env.NODE_ENV === "development"
              ? {
                  route,
                  status: 400,
                }
              : {}),
          },
        },
        { status: 400, headers: { "x-request-id": requestId } }
      );
    }

    if (provider === "custom" && !baseUrl) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            requestId,
            errorCode: "MODEL_BASE_URL_REQUIRED",
            safeMessage: "AI 生成失败，请检查模型配置或稍后再试",
            ...(process.env.NODE_ENV === "development"
              ? {
                  route,
                  status: 400,
                }
              : {}),
          },
        },
        { status: 400, headers: { "x-request-id": requestId } }
      );
    }

    await testChatCompletion({
      provider,
      model,
      baseUrl,
      apiKey,
    });

    return NextResponse.json({ ok: true, message: "Model connection succeeded." }, { headers: { "x-request-id": requestId } });
  } catch (error) {
    return buildApiErrorResponse({
      error,
      route,
      requestId,
      safeMessage: "AI 生成失败，请检查模型配置或稍后再试",
      errorCode: "MODEL_TEST_FAILED",
      status: 400,
    });
  }
}

async function getSavedConfig() {
  const user = await getCurrentUser();
  return getDecryptedDefaultModelConfig(user.id);
}
