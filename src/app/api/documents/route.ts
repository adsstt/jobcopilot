import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../server/auth/getCurrentUser";
import { listUserDocuments } from "../../../../server/db/documents";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getCurrentUser();
    const documents = await listUserDocuments(user.id);
    return NextResponse.json({ documents });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
