import type { User as SupabaseUser } from "@supabase/supabase-js";
import { prisma } from "./client";

export interface CurrentUser {
  id: string;
  email: string | null;
  name: string | null;
}

export async function upsertUserFromSupabase(authUser: SupabaseUser): Promise<CurrentUser> {
  const id = authUser.id;
  const email = authUser.email ?? null;
  const name = deriveUserName(authUser);

  return prisma.user.upsert({
    where: { id },
    create: { id, email, name },
    update: { email },
    select: { id: true, email: true, name: true },
  });
}

export async function updateUserProfile(userId: string, input: { name?: string }) {
  const name = input.name?.trim().slice(0, 80) || null;

  return prisma.user.update({
    where: { id: userId },
    data: { name },
    select: { id: true, email: true, name: true },
  });
}

function deriveUserName(authUser: SupabaseUser) {
  const metadataName =
    typeof authUser.user_metadata?.name === "string" && authUser.user_metadata.name.trim()
      ? authUser.user_metadata.name.trim()
      : null;

  if (metadataName) return metadataName;
  if (authUser.email?.includes("@")) return authUser.email.split("@")[0];
  return authUser.email ?? "User";
}
