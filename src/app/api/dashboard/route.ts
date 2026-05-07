import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";
import { getDashboardData } from "../../../../server/db/dashboard";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const dashboard = await getDashboardData(user.id);
    return NextResponse.json({ dashboard });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
