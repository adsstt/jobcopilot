import { unauthorized } from "../apiErrors";
import { createClient } from "../../src/lib/supabase/server";
import { headers } from "next/headers";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "../../src/lib/supabase/env";
import { upsertUserFromSupabase, type CurrentUser } from "../db/users";

export async function getCurrentUser(): Promise<CurrentUser> {
  const user = await getOptionalCurrentUser();
  if (!user) throw unauthorized();
  return user;
}

export async function getOptionalCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    const fallbackUser = await getCurrentUserFromAuthorizationHeader();
    if (fallbackUser) {
      return fallbackUser;
    }
    return null;
  }

  if (!user) return getCurrentUserFromAuthorizationHeader();
  return upsertUserFromSupabase(user);
}

async function getCurrentUserFromAuthorizationHeader(): Promise<CurrentUser | null> {
  const headerStore = await headers();
  const authorization = headerStore.get("authorization");

  if (!authorization?.toLowerCase().startsWith("bearer ")) {
    return null;
  }

  const token = authorization.slice(7).trim();
  if (!token) {
    return null;
  }

  const supabase = createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return upsertUserFromSupabase(user);
}
