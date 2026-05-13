"use client";

import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/views/Dashboard";
import { InterviewWizard } from "@/views/InterviewWizard";
import { StoryLibrary } from "@/views/StoryLibrary";
import { Settings } from "@/views/Settings";
import { DocumentsView } from "@/views/DocumentsView";
import { QuestionBank } from "@/views/QuestionBank";
import { ReviewsView } from "@/views/ReviewsView";
import { RoleTracks } from "@/views/RoleTracks";
import type { MatchAnalysis } from "@/lib/api";
import type { CurrentUser } from "../server/db/users";

export type ViewState = "dashboard" | "tracks" | "interview" | "library" | "questions" | "reviews" | "documents" | "settings";

interface AppProps {
  currentUser: CurrentUser;
  initialView?: ViewState;
  initialInterview?: {
    sessionId: string;
    roleTrack: string;
    resumeText: string;
    jdText: string;
    analysis: MatchAnalysis | null;
    history: Array<{ role: "ai" | "user"; content: string }>;
    autoStart: boolean;
  } | null;
}

export default function App({ currentUser, initialView = "dashboard", initialInterview = null }: AppProps) {
  const [currentView, setCurrentView] = useState<ViewState>(initialView);

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView} currentUser={currentUser}>
      {currentView === "dashboard" && (
        <Dashboard
          onStartInterview={() => setCurrentView("interview")}
          onOpenTracks={() => setCurrentView("tracks")}
          onOpenQuestions={() => setCurrentView("questions")}
          onOpenStories={() => setCurrentView("library")}
          currentUser={currentUser}
        />
      )}
      {currentView === "tracks" && (
        <RoleTracks
          onStartInterview={() => setCurrentView("interview")}
          onOpenQuestions={() => setCurrentView("questions")}
          onOpenStories={() => setCurrentView("library")}
        />
      )}
      {currentView === "interview" && <InterviewWizard onComplete={() => setCurrentView("dashboard")} initialInterview={initialInterview} />}
      {currentView === "library" && <StoryLibrary />}
      {currentView === "questions" && <QuestionBank onStartInterview={() => setCurrentView("interview")} />}
      {currentView === "reviews" && <ReviewsView onOpenQuestions={() => setCurrentView("questions")} />}
      {currentView === "documents" && <DocumentsView />}
      {currentView === "settings" && <Settings />}
    </Layout>
  );
}
