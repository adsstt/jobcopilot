import { prisma } from "./client";

export async function getDashboardData(userId: string) {
  const [sessionCount, reviewScores, storyCount, recentReview, roleGroups] = await Promise.all([
    prisma.interviewSession.count({
      where: {
        userId,
        OR: [{ status: "interviewing" }, { status: "review_ready" }, { messages: { some: {} } }],
      },
    }),
    prisma.review.findMany({
      where: { userId, score: { not: null } },
      select: { score: true },
    }),
    prisma.story.count({ where: { userId } }),
    prisma.review.findFirst({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        session: {
          select: {
            roleTrack: true,
            lastTestedSkill: true,
            status: true,
          },
        },
      },
    }),
    prisma.interviewSession.groupBy({
      by: ["roleTrack"],
      where: { userId },
      _count: { _all: true },
      _avg: { overallScore: true, matchScore: true },
      orderBy: { _count: { roleTrack: "desc" } },
      take: 4,
    }),
  ]);

  const averageScore = reviewScores.length
    ? Math.round(reviewScores.reduce((sum, item) => sum + (item.score || 0), 0) / reviewScores.length)
    : 0;

  return {
    stats: {
      completedTrainings: sessionCount,
      averageScore,
      storyCount,
    },
    recentReview: recentReview
      ? {
          id: recentReview.sessionId,
          title: recentReview.title,
          roleTrack: recentReview.session.roleTrack,
          focus: recentReview.summary,
          score: recentReview.score,
          rating: recentReview.rating,
          lastTestedSkill: recentReview.session.lastTestedSkill,
          updatedAt: recentReview.updatedAt.toISOString(),
        }
      : null,
    roleSummaries: roleGroups.map((group) => ({
      roleTrack: group.roleTrack,
      sessions: group._count._all,
      avgScore: Math.round(group._avg.overallScore || group._avg.matchScore || 0),
    })),
  };
}
