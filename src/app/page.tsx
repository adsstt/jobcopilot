import App, { type ViewState } from "@/App";
import { redirect } from "next/navigation";
import { getOptionalCurrentUser } from "../../server/auth/getCurrentUser";
import { getInterviewSessionAnalysis } from "../../server/db/aiSessions";

const viewSet = new Set<ViewState>(["dashboard", "tracks", "interview", "library", "questions", "reviews", "documents", "settings"]);

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string; sessionId?: string; autostart?: string }>;
}) {
  const currentUser = await getOptionalCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const requestedView = resolvedSearchParams?.view;
  const initialView = viewSet.has(requestedView as ViewState) ? (requestedView as ViewState) : "dashboard";

  let initialInterview = null;
  if (initialView === "interview" && resolvedSearchParams?.sessionId) {
    const session = await getInterviewSessionAnalysis(currentUser.id, resolvedSearchParams.sessionId);
    if (session && session.analysis) {
      initialInterview = {
        sessionId: session.id,
        roleTrack: session.roleTrack,
        resumeText: session.resumeText,
        jdText: session.jdText,
        analysis: session.analysis,
        autoStart: resolvedSearchParams.autostart === "1",
      };
    }
  }

  return <App currentUser={currentUser} initialView={initialView} initialInterview={initialInterview} />;
}
