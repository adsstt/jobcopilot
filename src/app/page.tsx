import App from "@/App";
import { redirect } from "next/navigation";
import { getOptionalCurrentUser } from "../../server/auth/getCurrentUser";

export default async function HomePage() {
  const currentUser = await getOptionalCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }
  return <App currentUser={currentUser} />;
}
