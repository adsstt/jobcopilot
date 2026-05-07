import { prisma } from "./client";

export interface CurrentUser {
  id: string;
  email: string | null;
  name: string | null;
}

export async function ensureDefaultUser(): Promise<CurrentUser> {
  const id = process.env.DEFAULT_USER_ID || "demo-user";
  const email = process.env.DEFAULT_USER_EMAIL || "demo@jobcopilot.local";
  const name = process.env.DEFAULT_USER_NAME || "George";

  return prisma.user.upsert({
    where: { id },
    create: { id, email, name },
    update: { email, name },
    select: { id: true, email: true, name: true },
  });
}
