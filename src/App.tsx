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
import type { CurrentUser } from "../server/db/users";

export type ViewState = "dashboard" | "tracks" | "interview" | "library" | "questions" | "reviews" | "documents" | "settings";

interface AppProps {
  currentUser: CurrentUser;
}

export default function App({ currentUser }: AppProps) {
  const [currentView, setCurrentView] = useState<ViewState>("dashboard");

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView} currentUser={currentUser}>
      {currentView === "dashboard" && (
        <Dashboard onStartInterview={() => setCurrentView("interview")} currentUser={currentUser} />
      )}
      {currentView === "tracks" && <RoleTracks onStartInterview={() => setCurrentView("interview")} />}
      {currentView === "interview" && <InterviewWizard onComplete={() => setCurrentView("dashboard")} />}
      {currentView === "library" && <StoryLibrary />}
      {currentView === "questions" && <QuestionBank onStartInterview={() => setCurrentView("interview")} />}
      {currentView === "reviews" && <ReviewsView />}
      {currentView === "documents" && <DocumentsView />}
      {currentView === "settings" && <Settings />}
    </Layout>
  );
}
