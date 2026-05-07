import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../server/auth/getCurrentUser";
import { getSessionTurns, saveAnswerAndAiResponse, saveInitialAiQuestion } from "../../../../../server/db/aiSessions";
import { createInterviewTurn, createInterviewTurnStream } from "../../../../../server/services/interview";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const user = await getCurrentUser();
    const interviewBody = await withPersistedHistory(body, user.id);

    if (interviewBody.stream) {
      return createStreamingResponse(interviewBody, user.id);
    }

    const result = await createInterviewTurn(interviewBody);
    const persistenceInput = {
      userId: user.id,
      sessionId: interviewBody.sessionId,
      roleTrack: interviewBody.roleTrack || interviewBody.analysis?.roleTrack || result.testedSkill || "技术岗",
      resumeText: interviewBody.resumeText || "",
      jdText: interviewBody.jdText || "",
      analysis: interviewBody.analysis,
      nextQuestion: result.nextQuestion,
      testedSkill: result.testedSkill,
      evaluation: result.evaluation,
    };

    const saved = interviewBody.answer
      ? await saveAnswerAndAiResponse({ ...persistenceInput, answer: interviewBody.answer })
      : await saveInitialAiQuestion(persistenceInput);

    return NextResponse.json({ ...result, sessionId: saved.sessionId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function createStreamingResponse(body: any, userId: string) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const write = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        let emittedText = "";
        const result = await createInterviewTurnStream(body, (text) => {
          emittedText += text;
          write({ type: "delta", text });
        });

        const persistenceInput = {
          userId,
          sessionId: body.sessionId,
          roleTrack: body.roleTrack || body.analysis?.roleTrack || result.testedSkill || "技术岗",
          resumeText: body.resumeText || "",
          jdText: body.jdText || "",
          analysis: body.analysis,
          nextQuestion: result.nextQuestion,
          testedSkill: result.testedSkill,
          evaluation: result.evaluation,
        };

        const saved = body.answer
          ? await saveAnswerAndAiResponse({ ...persistenceInput, answer: body.answer })
          : await saveInitialAiQuestion(persistenceInput);

        if (!emittedText && result.nextQuestion) {
          write({ type: "delta", text: result.nextQuestion });
        }

        write({ type: "done", result: { ...result, sessionId: saved.sessionId } });
        controller.close();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        write({ type: "error", error: message });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

async function withPersistedHistory(body: any, userId: string) {
  if (Array.isArray(body.history) && body.history.length > 0) return body;
  if (!body.sessionId) return body;

  const history = await getSessionTurns(userId, body.sessionId);
  return { ...body, history };
}
