import React from "react";
import { BookOpenText, FileStack, Home, Library, ListChecks, Mic, Settings, Sparkles, Target } from "lucide-react";
import type { ViewState } from "@/App";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { cn } from "@/lib/utils";
import type { CurrentUser } from "../../../server/db/users";

interface LayoutProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  currentUser: CurrentUser;
  children: React.ReactNode;
}

export function Layout({ currentView, onViewChange, currentUser, children }: LayoutProps) {
  const displayName = currentUser.name || currentUser.email?.split("@")[0] || "User";
  const emailLabel = currentUser.email || "已登录用户";
  const avatarLabel = displayName.slice(0, 1).toUpperCase();

  const navItems = [
    { id: "dashboard", label: "首页", icon: Home },
    { id: "tracks", label: "岗位方向", icon: Target },
    { id: "interview", label: "模拟面试", icon: Mic },
    { id: "library", label: "故事库", icon: Library },
    { id: "questions", label: "题库", icon: BookOpenText },
    { id: "reviews", label: "复盘", icon: ListChecks },
    { id: "documents", label: "资料", icon: FileStack },
    { id: "settings", label: "设置", icon: Settings },
  ] as const;

  return (
    <div className="flex h-screen w-full max-w-full flex-col overflow-x-hidden bg-slate-50 font-sans md:flex-row">
      <aside className="hidden max-h-screen w-72 flex-col border-r border-slate-200 bg-white px-6 py-8 md:flex">
        <div className="flex items-center gap-2 px-2 pb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Sparkles size={20} />
          </div>
          <span className="font-serif text-xl font-bold italic tracking-tight text-slate-900">JobCopilot</span>
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-full px-4 py-3 text-left text-sm font-medium transition-colors",
                currentView === item.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-2">
          <div className="rounded-3xl bg-slate-100 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {avatarLabel}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-900">{displayName}</div>
                <div className="truncate text-xs text-slate-500">{emailLabel}</div>
              </div>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      <main className="relative min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 z-0 bg-dotted-pattern opacity-50" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-6 pb-32 sm:p-6 sm:pb-32 md:p-12">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex min-h-20 max-w-full items-center gap-1 overflow-x-auto overscroll-x-contain rounded-t-3xl border-t border-slate-200 bg-white/85 px-3 pb-safe pt-2 shadow-xl backdrop-blur-xl scrollbar-hide md:hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex min-w-[58px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl p-2 transition-all duration-200",
              currentView === item.id ? "scale-110 text-indigo-600" : "text-slate-400"
            )}
          >
            <item.icon size={24} className={currentView === item.id ? "fill-indigo-50" : ""} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
