import { unauthorized } from "../apiErrors";
import { createClient } from "../../src/lib/supabase/server";
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
    const message = error.message.toLowerCase();
    const isMissingSessionError =
      message.includes("auth session missing") ||
      message.includes("session from session_id claim in jwt does not exist") ||
      message.includes("session missing");

    if (isMissingSessionError) {
      return null;
    }

    throw unauthorized("Unable to validate the current session.");
  }

  if (!user) return null;
  return upsertUserFromSupabase(user);
}
