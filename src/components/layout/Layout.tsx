import React from "react";
import { BookOpenText, FileStack, Home, Library, ListChecks, Mic, Settings, Sparkles, Target } from "lucide-react";
import { ViewState } from "@/App";
import { cn } from "@/lib/utils";

interface LayoutProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  children: React.ReactNode;
}

export function Layout({ currentView, onViewChange, children }: LayoutProps) {
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
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white px-6 py-8 md:flex max-h-screen">
        <div className="flex items-center gap-2 px-2 pb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 text-white">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-serif italic">JobCopilot</span>
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
          <div className="mb-4 rounded-3xl border border-indigo-100 bg-indigo-50 p-4 text-indigo-950">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-500">Next drill</div>
            <div className="mt-2 text-sm font-bold">技术岗 · 系统设计追问</div>
            <div className="mt-1 text-xs leading-relaxed text-indigo-700">预计 5 分钟，补强业务指标表达。</div>
          </div>
          <div className="flex items-center gap-3 rounded-3xl bg-slate-100 p-3">
            <img
              src="https://i.pravatar.cc/100?img=33"
              alt="User"
              className="h-10 w-10 rounded-full bg-slate-300"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">George</span>
              <span className="text-xs text-slate-500">免费版</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="absolute inset-0 bg-dotted-pattern pointer-events-none opacity-50 z-0"></div>
        <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-6 pb-32 sm:p-6 sm:pb-32 md:p-12">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex max-w-full items-center gap-1 overflow-x-auto overscroll-x-contain border-t border-slate-200 bg-white/85 pb-safe px-3 pt-2 backdrop-blur-xl md:hidden min-h-20 rounded-t-3xl shadow-xl scrollbar-hide">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex min-w-[58px] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl p-2 transition-all duration-200",
              currentView === item.id ? "text-indigo-600 scale-110" : "text-slate-400"
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
