import App from "@/App";
import { notFound, redirect } from "next/navigation";
import { getOptionalCurrentUser } from "../../../../server/auth/getCurrentUser";
import { getInterviewSessionAnalysis } from "../../../../server/db/aiSessions";

export default async function ResumeInterviewPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const currentUser = await getOptionalCurrentUser();
  if (!currentUser) {
    redirect("/login");
  }

  const { sessionId } = await params;
  const session = await getInterviewSessionAnalysis(currentUser.id, sessionId);
  if (!session || !session.analysis) {
    notFound();
  }

  return (
    <App
      currentUser={currentUser}
      initialView="interview"
      initialInterview={{
        sessionId: session.id,
        roleTrack: session.roleTrack,
        resumeText: session.resumeText,
        jdText: session.jdText,
        analysis: session.analysis,
        history: session.messages,
        autoStart: session.messages.length === 0,
      }}
    />
  );
}
