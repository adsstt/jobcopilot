import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { providerDefaults, normalizeProvider } from "../../../../../server/db/modelConfigs";
import { getDecryptedDefaultModelConfig } from "../../../../../server/db/modelConfigs";
import { testChatCompletion } from "../../../../../server/ai/providers";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const savedConfig = body.apiKey ? null : await getSavedConfig();
    const provider = normalizeProvider(body.provider || savedConfig?.provider || "mock");
    const defaults = providerDefaults[provider];
    const baseUrl = (body.baseUrl || savedConfig?.baseUrl || defaults.baseUrl || "").trim().replace(/\/$/, "");
    const model = (body.model || savedConfig?.model || defaults.model || provider).trim();
    const apiKey = String(body.apiKey || savedConfig?.apiKey || "").trim();

    if (provider === "mock") {
      return NextResponse.json({ ok: true, message: "Mock provider is available." });
    }

    if (!apiKey) {
      return NextResponse.json({ ok: false, error: "API Key is required to test this provider." }, { status: 400 });
    }

    if (provider === "custom" && !baseUrl) {
      return NextResponse.json({ ok: false, error: "Base URL is required for custom providers." }, { status: 400 });
    }

    await testChatCompletion({
      provider,
      model,
      baseUrl,
      apiKey,
    });

    return NextResponse.json({ ok: true, message: "Model connection succeeded." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

async function getSavedConfig() {
  const user = await getCurrentUser();
  return getDecryptedDefaultModelConfig(user.id);
}
