import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { getSafeDefaultModelConfig, saveDefaultModelConfig } from "../../../../../server/db/modelConfigs";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const config = await getSafeDefaultModelConfig(user.id);
    return NextResponse.json({ config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    return NextResponse.json({ config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
