import { AnalysisDetailReport } from "@/components/analysis/AnalysisDetailReport";
import { notFound, redirect } from "next/navigation";
import { getInterviewSessionAnalysis } from "../../../../server/db/aiSessions";
import { getOptionalCurrentUser } from "../../../../server/auth/getCurrentUser";

export default async function AnalysisDetailPage({ params }: { params: Promise<{ sessionId: string }> }) {
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
    <AnalysisDetailReport
      analysis={session.analysis}
      roleTrack={session.roleTrack}
      sessionId={session.id}
      status={session.status}
      createdAt={formatDateTime(session.createdAt)}
      updatedAt={formatDateTime(session.updatedAt)}
      startInterviewHref={`/interview/${session.id}`}
    />
  );
}

function formatDateTime(value: Date) {
  return value.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
