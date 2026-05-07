import { ensureDefaultUser, type CurrentUser } from "../db/users";

export async function getCurrentUser(): Promise<CurrentUser> {
  // Temporary single-user resolver. Replace this file with Supabase Auth,
  // Clerk, or another request-aware resolver when login is introduced.
  return ensureDefaultUser();
}
