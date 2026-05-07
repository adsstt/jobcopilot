# JobCopilot 前端 React 源文件交接

这份文档包含了本项目所有的 React (TSX) 组件、UI 库和 Tailwind CSS 布局代码，由于应用是基于 Vite + React + Tailwind 构建的单页应用，直接将这些组件代码发给 Codex 它就能完美理解整个 UI。

## `src/index.css`
```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Playfair Display", ui-serif, Georgia, serif;
}

@layer utilities {
  .bg-dotted-pattern {
    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size: 24px 24px;
  }
}

html, body {
  @apply bg-[#f8fafc] text-slate-900 font-sans antialiased;
}

```

## `src/lib/utils.ts`
```tsx
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

## `src/components/ui/index.tsx`
```tsx
import { cn } from "@/lib/utils";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-slate-900 text-white hover:bg-slate-900/90": variant === "primary",
            "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm": variant === "secondary",
            "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900": variant === "outline",
            "hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
            "h-9 px-4 py-2": size === "sm",
            "h-12 px-8 py-2 text-base": size === "md",
            "h-14 rounded-full px-10 text-lg": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-slate-100 bg-white text-slate-950 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

```

## `src/components/layout/Layout.tsx`
```tsx
import React from "react";
import { Home, Mic, Library, Settings, Sparkles, FileText, Briefcase } from "lucide-react";
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
    { id: "interview", label: "模拟面试", icon: Mic },
    { id: "jobs", label: "职位库", icon: Briefcase },
    { id: "resumes", label: "简历库", icon: FileText },
    { id: "library", label: "故事库", icon: Library },
    { id: "settings", label: "设置", icon: Settings },
  ] as const;

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 md:flex-row font-sans">
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
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        <div className="absolute inset-0 bg-dotted-pattern pointer-events-none opacity-50 z-0"></div>
        <div className="relative z-10 mx-auto w-full max-w-5xl p-6 pb-32 md:p-12">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200 bg-white/80 pb-safe pt-2 px-4 backdrop-blur-xl md:hidden h-20 rounded-t-3xl shadow-xl">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-2xl p-2 min-w-[64px] transition-all duration-200",
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

```

## `src/App.tsx`
```tsx
import React, { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/views/Dashboard";
import { InterviewWizard } from "@/views/InterviewWizard";
import { StoryLibrary } from "@/views/StoryLibrary";
import { Settings } from "@/views/Settings";
import { ResumeLibrary } from "@/views/ResumeLibrary";
import { JobLibrary } from "@/views/JobLibrary";

export type ViewState = "dashboard" | "interview" | "library" | "settings" | "resumes" | "jobs";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("dashboard");

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === "dashboard" && <Dashboard onStartInterview={() => setCurrentView("interview")} />}
      {currentView === "interview" && <InterviewWizard onComplete={() => setCurrentView("dashboard")} />}
      {currentView === "library" && <StoryLibrary />}
      {currentView === "resumes" && <ResumeLibrary />}
      {currentView === "jobs" && <JobLibrary />}
      {currentView === "settings" && <Settings />}
    </Layout>
  );
}

```

## `src/views/Dashboard.tsx`
```tsx
import React from "react";
import { Button, Card } from "@/components/ui";
import { Search, Briefcase, FileText, ArrowUpRight, Code, PenTool, LayoutDashboard } from "lucide-react";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";

interface DashboardProps {
  onStartInterview: () => void;
}

export function Dashboard({ onStartInterview }: DashboardProps) {
  const activeRoles = [
    { title: "产品经理", jobs: "3.2k 个岗位", icon: LayoutDashboard, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "UX/UI 设计师", jobs: "1.4k 个岗位", icon: PenTool, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "前端开发", jobs: "4.8k 个岗位", icon: Code, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="flex flex-col gap-10">
      {/* Mobile Header (Hidden on Desktop, shown in Mobile Image 1) */}
      <div className="flex items-center justify-between md:hidden">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/100?img=33" alt="George" className="h-12 w-12 rounded-full" />
          <div className="flex flex-col">
            <span className="text-sm text-slate-500">你好</span>
            <span className="text-lg font-bold">George</span>
          </div>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100">
          <Briefcase size={20} className="text-slate-700" />
        </button>
      </div>

      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold tracking-wider text-indigo-600 md:hidden uppercase">训练方向</span>
        <h1 className="font-serif text-5xl font-medium tracking-tight text-slate-900 md:text-6xl italic">
          你好 George 👋<br />
          <span className="not-italic text-4xl md:text-5xl">准备好开始训练了吗？</span>
        </h1>
      </header>

      {/* Main Start Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="flex flex-col gap-6 p-8 relative overflow-hidden bg-slate-900 text-white border-0 shadow-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Briefcase size={120} />
          </div>
          <div className="relative z-10 flex flex-col gap-4 max-w-lg">
            <h2 className="text-3xl font-semibold">开始新的模拟面试</h2>
            <p className="text-indigo-100 text-lg">
              上传你的简历和目标职位描述，获取量身定制的面试痛点分析和预测问题。
            </p>
            <Button size="lg" className="self-start mt-4 bg-white text-slate-900 hover:bg-slate-100 shadow-xl" onClick={onStartInterview}>
              创建练习
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Role Tracks */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">你的特定方向</h3>
          <button className="text-sm font-semibold text-slate-500">全部</button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {activeRoles.map((role, i) => (
            <motion.div key={role.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
              <Card className="flex cursor-pointer flex-col gap-4 p-5 transition-transform hover:-translate-y-1 hover:shadow-md">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", role.bg, role.color)}>
                  <role.icon size={24} />
                </div>
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{role.title}</span>
                    <span className="text-xs text-slate-500 font-medium">{role.jobs}</span>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-slate-100">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Recent History */}
       <section className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">最近练习记录</h3>
        <Card className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
               <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-red-50 text-red-600">
                  <Briefcase size={24} />
               </div>
               <div className="flex flex-col">
                 <span className="font-bold text-lg">高级交互设计师</span>
                 <span className="text-sm font-medium text-slate-500">Adobe • 2天前</span>
               </div>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full self-start md:self-auto">85% 岗位匹配度</span>
              <span className="text-xs font-semibold text-slate-500">查看报告</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

```

## `src/views/InterviewWizard.tsx`
```tsx
import React, { useState } from "react";
import { Button, Card } from "@/components/ui";
import { ChevronLeft, UploadCloud, FileText, CheckCircle2, Mic, Square, Play, Sparkles, Image as ImageIcon, Type } from "lucide-react";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";

type Step = "upload" | "analyze" | "interview" | "review";

interface WizardProps {
  onComplete: () => void;
}

export function InterviewWizard({ onComplete }: WizardProps) {
  const [step, setStep] = useState<Step>("upload");

  return (
    <div className="flex h-full flex-col max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between pb-8">
        <button
          onClick={() => (step === "upload" ? onComplete() : setStep("upload"))}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 transition-colors hover:bg-slate-50"
        >
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <span className="font-semibold text-slate-500 tracking-widest text-sm">
          {step === "upload" && "第一步：准备阶段"}
          {step === "analyze" && "第二步：智能分析"}
          {step === "interview" && "第三步：模拟面试"}
          {step === "review" && "第四步：深度复盘"}
        </span>
        <div className="w-12" /> {/* Spacer */}
      </header>

      {/* Content Area */}
      <div className="flex-1">
        {step === "upload" && <UploadStep onNext={() => setStep("analyze")} />}
        {step === "analyze" && <AnalyzeStep onNext={() => setStep("interview")} />}
        {step === "interview" && <InterviewStep onNext={() => setStep("review")} />}
        {step === "review" && <ReviewStep onFinish={onComplete} />}
      </div>
    </div>
  );
}

// --- Steps Components ---

function UploadStep({ onNext }: { onNext: () => void }) {
  const [resumeMode, setResumeMode] = useState<"file" | "text">("file");
  const [jdMode, setJdMode] = useState<"text" | "file">("text");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <div>
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">设定目标岗位</h2>
        <p className="text-slate-500 text-lg">请上传你的求职材料，我们将据此生成精准、贴合岗位的面试问题。</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Resume Card */}
        <Card className="p-6 flex flex-col gap-4 border-2 border-slate-100 hover:border-slate-200 transition-colors">
           <div className="flex justify-between items-start">
             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
               <FileText size={24} />
             </div>
           </div>
           
           <div>
             <h3 className="text-xl font-bold">你的简历</h3>
             <p className="text-sm text-slate-500 mt-1">我们将用它来提取你的过往经历与闪光点。</p>
           </div>
           
           <div className="flex bg-slate-100 p-1 rounded-lg w-fit mt-2">
              <button 
                onClick={() => setResumeMode("file")}
                className={cn("px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2", resumeMode === "file" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-800")}>
                <UploadCloud size={16}/> 文件/图片
              </button>
              <button 
                onClick={() => setResumeMode("text")}
                className={cn("px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2", resumeMode === "text" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-800")}>
                <Type size={16}/> 粘贴文本
              </button>
           </div>

           {resumeMode === "file" ? (
             <button className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:border-indigo-300 hover:text-indigo-600 transition-all group mt-2 w-full">
               <UploadCloud size={32} className="group-hover:scale-110 transition-transform" />
               <span className="font-semibold text-slate-700">点击或拖拽上传简历</span>
               <span className="text-xs text-slate-500 flex gap-2 items-center mt-1">
                  <FileText size={14}/> PDF / Word
                  <ImageIcon size={14} className="ml-1"/> 图片 (扫描件)
               </span>
             </button>
           ) : (
             <textarea 
               className="w-full flex-1 rounded-2xl bg-white border border-slate-200 p-4 text-sm outline-none placeholder:text-slate-400 min-h-[160px] resize-none focus:ring-2 ring-indigo-500/20 focus:border-indigo-500 transition-all mt-2"
               placeholder="在此处粘贴你的简历纯文本..."
             />
           )}
        </Card>

        {/* JD Card */}
        <Card className="p-6 flex flex-col gap-4 border-2 border-slate-100 hover:border-slate-200 transition-colors">
           <div className="flex justify-between items-start">
             <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
               <BriefcaseIcon size={24} />
             </div>
           </div>
           
           <div>
             <h3 className="text-xl font-bold">职位描述 (JD)</h3>
             <p className="text-sm text-slate-500 mt-1">提供目标职位的详细要求，系统将据此对齐考察重点。</p>
           </div>
           
           <div className="flex bg-slate-100 p-1 rounded-lg w-fit mt-2">
              <button 
                onClick={() => setJdMode("file")}
                className={cn("px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2", jdMode === "file" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-800")}>
                <UploadCloud size={16}/> 文件/截图
              </button>
              <button 
                onClick={() => setJdMode("text")}
                className={cn("px-4 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2", jdMode === "text" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-800")}>
                <Type size={16}/> 粘贴文本
              </button>
           </div>

           {jdMode === "file" ? (
             <button className="flex h-40 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:border-emerald-300 hover:text-emerald-600 transition-all group mt-2 w-full">
               <UploadCloud size={32} className="group-hover:scale-110 transition-transform" />
               <span className="font-semibold text-slate-700">上传岗位要求截图或文件</span>
               <span className="text-xs text-slate-500 flex gap-2 items-center mt-1">
                  <ImageIcon size={14}/> 截图/图片
                  <FileText size={14} className="ml-1"/> PDF / Word
               </span>
             </button>
           ) : (
             <textarea 
               className="w-full flex-1 rounded-2xl bg-white border border-slate-200 p-4 text-sm outline-none placeholder:text-slate-400 min-h-[160px] resize-none focus:ring-2 ring-emerald-500/20 focus:border-emerald-500 transition-all mt-2"
               placeholder="在此处粘贴职位描述文本..."
             />
           )}
        </Card>
      </div>

      <Button size="lg" className="w-full md:w-auto md:self-end mt-4 shadow-xl" onClick={onNext}>
        开始智能分析
      </Button>
    </motion.div>
  );
}

function AnalyzeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-8">
       <div>
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">分析完成</h2>
        <p className="text-slate-500 text-lg">以下是你的过往能力与目标岗位的匹配情况。</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="md:col-span-1 p-8 bg-slate-900 text-white flex flex-col items-center justify-center gap-4 border-0">
            <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-8 border-indigo-500/30">
               <span className="text-4xl font-bold">85%</span>
               <svg className="absolute inset-0 h-full w-full -rotate-90">
                 <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-indigo-500" strokeDasharray="351" strokeDashoffset="50" />
               </svg>
            </div>
            <span className="font-semibold text-lg">人岗匹配度</span>
         </Card>

         <Card className="md:col-span-2 p-8 flex flex-col gap-6">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-600 mb-3"><CheckCircle2 size={20} /> 你的核心优势</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 text-sm text-slate-700 font-medium">✓ 优秀的系统架构设计经验，高度匹配岗位对资深开发者的期待。</li>
                <li className="flex gap-2 text-sm text-slate-700 font-medium">✓ React 和 TypeScript 技能深度契合目标技术栈要求。</li>
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-amber-600 mb-3"><Sparkles size={20} /> 预测高频考点</h3>
              <ul className="space-y-2">
                <li className="flex gap-2 text-sm text-slate-700 font-medium">⚠️ 请准备好应对关于“超大型复杂状态管理”的深入探讨。</li>
                <li className="flex gap-2 text-sm text-slate-700 font-medium">⚠️ 面试官极有可能会追问你在 CI/CD 流水线建设上的具体贡献。</li>
              </ul>
            </div>
         </Card>
      </div>

      <Button size="lg" className="w-full md:w-auto md:self-end shadow-xl" onClick={onNext}>
        开始模拟面试
      </Button>
    </motion.div>
  );
}

function InterviewStep({ onNext }: { onNext: () => void }) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full flex-col pb-8">
       {/* Live AI Status */}
       <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-indigo-50 shadow-inner">
            <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-20"></div>
            <Sparkles size={48} className="text-indigo-600" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">AI 面试官</h2>
            <p className="text-slate-500">正在倾听...</p>
          </div>
       </div>

       {/* Transcript Area */}
       <Card className="flex-1 p-6 mb-8 bg-white/50 backdrop-blur border border-indigo-100/50 shadow-sm overflow-hidden flex flex-col gap-6">
         <div className="flex gap-4">
           <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0"><Sparkles size={16} className="text-indigo-600"/></div>
           <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm text-sm font-medium border border-slate-100">
             "你好，George。我看到你的简历里提到你主导团队把前端架构迁移到了 React。能详细聊讲讲在这个过程中，你遇到过的最大的技术挑战是什么吗？"
           </div>
         </div>
       </Card>

       {/* Controls */}
       <div className="flex items-center justify-center gap-6 mt-auto">
          <Button variant="outline" size="icon" className="h-16 w-16 text-slate-400">
             <Play size={24} fill="currentColor"/>
          </Button>
          
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={cn(
              "flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all duration-300",
              isRecording ? "bg-red-500 scale-110 ring-8 ring-red-500/20" : "bg-slate-900 hover:bg-slate-800 hover:scale-105"
            )}
          >
             {isRecording ? <Square size={32} className="text-white" fill="currentColor" /> : <Mic size={40} className="text-white" />}
          </button>

          <Button variant="outline" size="icon" className="h-16 w-16 text-slate-900 bg-white shadow-sm" onClick={onNext}>
             <CheckCircle2 size={24}/>
          </Button>
       </div>
    </motion.div>
  );
}

function ReviewStep({ onFinish }: { onFinish: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <div>
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">深度复盘报告</h2>
        <p className="text-slate-500 text-lg">基于实际表现的全方位分析与重塑建议，把每次错误转化为宝贵经验。</p>
      </div>

      <Card className="p-8 pb-0 overflow-hidden bg-slate-900 text-white border-0 flex flex-col md:flex-row gap-8">
         <div className="flex flex-col gap-2 flex-1 pb-8">
           <span className="text-indigo-200 font-semibold tracking-widest text-sm">综合评级</span>
           <div className="flex items-end gap-2">
             <span className="text-7xl font-bold font-serif leading-none">A-</span>
           </div>
           <p className="mt-4 text-slate-300 text-lg">你回答技术问题的逻辑框架很棒。但如果要拿到更高分数，建议在描述中补充“业务影响力”和“衡量指标”。</p>
         </div>
         <div className="md:w-64 bg-indigo-600/20 p-8 flex flex-col justify-center border-l border-white/10 relative">
           <div className="text-sm font-semibold mb-2">核心素质表现</div>
           <div className="space-y-4 w-full">
             <div><div className="flex justify-between text-xs mb-1"><span>沟通与表达</span><span>92%</span></div><div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-white w-[92%] rounded-full"></div></div></div>
             <div><div className="flex justify-between text-xs mb-1"><span>技术深度沉淀</span><span>88%</span></div><div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-white w-[88%] rounded-full"></div></div></div>
           </div>
         </div>
      </Card>

      <section>
        <h3 className="text-xl font-bold mb-4">案例重塑：把经历升华为满分故事</h3>
        <Card className="p-6 flex flex-col gap-4 border-indigo-100 bg-indigo-50/50">
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">你的原始回答</span>
            <p className="text-slate-700 italic text-sm">"我们决定迁移到 React 是因为原来那个老框架太占内存太慢了。我负责搭了新代码库，然后整个团队基本就是一页一页往下重写，大概忙活了好几个月。"</p>
          </div>
          <div className="flex justify-center -my-2 z-10"><div className="bg-indigo-600 text-white rounded-full p-2"><Sparkles size={16}/></div></div>
          <div className="bg-indigo-600 p-5 rounded-xl text-white shadow-md">
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider block mb-2">🪄 AI 重塑建议 (套用 STAR 法则)</span>
            <p className="font-medium text-sm leading-relaxed">"当时的旧框架由于渲染性能瓶颈，导致我们移动端页面的转化率流失了30%（情境）。以此为契机，我主导了全面向 React 迁移的技术攻坚战（任务）。为了降低风险，我设计了一套微前端分离架构，让新老页面能共存并逐一替换，实现了零停机升级（行动）。最终在3个月内，我们将首屏加载速度提升了40%，彻底摆脱了技术债，团队迭代速度显著加快（结果）。"</p>
          </div>
        </Card>
      </section>

      <Button size="lg" className="w-full md:w-auto md:self-end mt-4 shadow-xl" onClick={onFinish}>
        返回训练大厅
      </Button>
    </motion.div>
  );
}

// Icon helper
function BriefcaseIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
}

```

## `src/views/StoryLibrary.tsx`
```tsx
import React from 'react';
import { Card, Button } from '@/components/ui';
import { Plus, Tag, RefreshCw, Star } from 'lucide-react';
import * as motion from "motion/react-client";

export function StoryLibrary() {
   return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
         <header className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">个人故事库</h1>
              <p className="text-slate-500 text-lg">沉淀你的高光时刻，系统会自动为你翻译成不同考察场景下的满分回答。</p>
            </div>
            <Button className="hidden md:flex gap-2 shadow-sm"><Plus size={18}/> 新增经历</Button>
         </header>

         {/* 移动端新建按钮 */}
         <Button className="md:hidden justify-center gap-2 w-full"><Plus size={18}/> 新增经历</Button>

         <div className="grid gap-6">
            <Card className="p-6 transition-all hover:shadow-md">
               <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                 <div>
                   <h3 className="text-xl font-bold">主导移动端前端架构向 React 迁移</h3>
                   <p className="text-sm text-slate-500 mt-1">最近一次修改: 刚才 · 来源于面试复盘收藏</p>
                 </div>
                 <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex gap-1 items-center self-start">
                    <Star size={12}/> 高分素材
                 </span>
               </div>
               
               <div className="flex flex-wrap gap-2 mb-4">
                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md flex items-center gap-1"><Tag size={12}/> 系统规划</span>
                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md flex items-center gap-1"><Tag size={12}/> 团队协作</span>
                 <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md flex items-center gap-1"><Tag size={12}/> 技术攻坚</span>
               </div>
               
               <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 leading-relaxed relative overflow-hidden">
                 <div className="flex gap-2 overflow-x-auto pb-2 mb-4 border-b border-slate-200 scrollbar-hide">
                    <button className="whitespace-nowrap text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1">STAR 结构版</button>
                    <button className="whitespace-nowrap text-slate-500 font-medium pb-1 px-3 hover:text-slate-800 transition">业务结果版</button>
                    <button className="whitespace-nowrap text-slate-500 font-medium pb-1 px-3 hover:text-slate-800 transition">技术深挖版</button>
                    <button className="whitespace-nowrap text-slate-500 font-medium pb-1 px-3 hover:text-slate-800 transition">管理协作版</button>
                 </div>
                 <div className="space-y-4">
                     <div>
                       <strong className="text-slate-900 block mb-1">Situation (情境)</strong> 
                       之前的旧框架由于渲染性能瓶颈，导致我们移动端页面的极高跳出率，转化率流失了约30%。
                     </div>
                     <div>
                       <strong className="text-slate-900 block mb-1">Task (任务)</strong>
                       作为前端架构负责人，我需要主导全面向 React 迁移的技术攻坚战，且不能影响现有业务迭代。
                     </div>
                     <div>
                       <strong className="text-slate-900 block mb-1">Action (行动)</strong>
                       为了降低风险，我设计了一套微前端分离架构，通过 Nginx 流量分配让新老页面能共存并逐一替换，实现了零停机升级。同时封装了底层的核心组件库供业务开发共用。
                     </div>
                     <div>
                       <strong className="text-slate-900 block mb-1">Result (结果)</strong>
                       最终在3个月内完成核心链路迁移，首屏加载速度（FCP）提升了40%，移动端订单转化率回暖，同时团队日常迭代速度显著加快。
                     </div>
                 </div>
               </div>
               <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
                   <Button variant="outline" size="sm" className="gap-2 text-slate-600 w-full sm:w-auto"><RefreshCw size={16}/> 重新生成表达结构</Button>
               </div>
            </Card>

            <Card className="p-6 relative overflow-hidden opacity-60">
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                 <Button variant="secondary" className="shadow-lg">解锁更多经历槽位</Button>
              </div>
              <div className="flex justify-between items-start mb-4 blur-sm select-none">
                 <div>
                   <h3 className="text-xl font-bold">主导双十一大促营销会场从 0 到 1 建设</h3>
                   <p className="text-sm text-slate-500 mt-1">来源于提取的简历经历</p>
                 </div>
               </div>
               <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-400 blur-sm select-none h-24">
                 在短时间内协同多个部门完成了...
               </div>
            </Card>
         </div>
      </motion.div>
   )
}

```

## `src/views/Settings.tsx`
```tsx
import React from 'react';
import { Card, Button } from '@/components/ui';
import { User, Bell, Shield, Bot } from 'lucide-react';
import * as motion from "motion/react-client";

export function Settings() {
   return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
         <header>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">系统偏好设置</h1>
            <p className="text-slate-500 text-lg">定制属于你的 AI 面试官风格体系与训练偏好。</p>
         </header>

         <div className="grid md:grid-cols-4 gap-8">
             {/* 侧边设置导航 */}
             <div className="md:col-span-1 flex flex-col gap-2">
                <button className="flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"><User size={18}/> 个人资料</button>
                <button className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 text-white font-semibold shadow-md"><Bot size={18}/> AI 面试偏好</button>
                <button className="flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"><Bell size={18}/> 通知与提醒</button>
                <button className="flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"><Shield size={18}/> 账号与安全</button>
             </div>

             {/* 核心设置内容 */}
             <div className="md:col-span-3 flex flex-col gap-6">
                <Card className="p-6 md:p-8 flex flex-col gap-8 border-0 shadow-sm">
                    <h2 className="text-xl font-bold border-b border-slate-100 pb-4">AI 面试环境配置</h2>
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-900 flex justify-between items-center cursor-pointer">
                            <span className="text-lg">开启压力面试模式</span>
                            <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center p-1 justify-end transition-colors shadow-inner">
                                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </label>
                        <p className="text-sm text-slate-500 leading-relaxed pr-12">
                            开启后，AI 将启用严格模式：增加追问频率、发起对逻辑漏洞的反击式质疑，并模拟高并发环境下的高压外企或大厂面试体感。建议在有充分准备后开启。
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                        <label className="font-bold text-slate-900 text-lg">AI 面试官话术风格</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                            <div className="border-2 border-indigo-600 bg-indigo-50/50 text-indigo-700 p-4 rounded-xl text-center cursor-pointer transition relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">当前</div>
                                <div className="font-bold mb-1">外企温和流 (Default)</div>
                                <div className="text-xs text-indigo-600/70 font-medium">鼓励式反馈，礼貌性深挖</div>
                            </div>
                            <div className="border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 p-4 rounded-xl text-center cursor-pointer transition">
                                <div className="font-bold text-slate-700 mb-1">大厂逻辑流</div>
                                <div className="text-xs text-slate-500">直击痛点，重框架轻情绪</div>
                            </div>
                            <div className="border border-slate-200 hover:border-red-300 hover:bg-red-50 p-4 rounded-xl text-center cursor-pointer transition group">
                                <div className="font-bold text-slate-700 group-hover:text-red-700 mb-1">毒舌质疑流</div>
                                <div className="text-xs text-slate-500 group-hover:text-red-600/70">极致施压，挑刺与反驳</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                        <label className="font-bold text-slate-900 text-lg">默认面试语言</label>
                        <p className="text-sm text-slate-500 mb-2">设置后，模拟面试中的系统提问与语音识别将以此语言为准。</p>
                        <select className="bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium max-w-sm appearance-none cursor-pointer">
                            <option>中文 (普通话)</option>
                            <option>English (US)</option>
                            <option>中英混合模式 (夹杂职场黑话识别)</option>
                        </select>
                    </div>
                </Card>

                <div className="flex justify-end gap-3 px-2">
                    <Button variant="ghost">取消</Button>
                    <Button className="shadow-lg px-8">保存偏好更改</Button>
                </div>
             </div>
         </div>
      </motion.div>
   )
}

```

## `src/views/ResumeLibrary.tsx`
```tsx
import React from 'react';
import { Card, Button } from '@/components/ui';
import { Plus, FileText, Download, MoreVertical, Calendar, UploadCloud } from 'lucide-react';
import * as motion from "motion/react-client";

export function ResumeLibrary() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">简历库</h1>
          <p className="text-slate-500 text-lg">统一管理你的多版本简历，针对不同岗位方向量身定制。</p>
        </div>
        <Button className="hidden md:flex gap-2 shadow-sm"><Plus size={18}/> 上传新简历</Button>
      </header>

      {/* 移动端新建按钮 */}
      <Button className="md:hidden justify-center gap-2 w-full"><Plus size={18}/> 上传新简历</Button>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
         <button className="flex h-48 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:border-indigo-300 hover:text-indigo-600 transition-all group w-full">
           <UploadCloud size={32} className="group-hover:scale-110 transition-transform" />
           <span className="font-semibold text-slate-700">点击上传新版本简历</span>
         </button>

         {/* Resume Card 1 */}
         <Card className="p-6 transition-all hover:shadow-md flex flex-col gap-4 border-2 border-slate-100">
            <div className="flex justify-between items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FileText size={24} />
              </div>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16}/></button>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">资深交互设计师_2026.pdf</h3>
              <div className="flex gap-4 mt-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={13}/> 2026-04-15更新</span>
                <span>2.4 MB</span>
              </div>
            </div>

            <div className="flex gap-2">
               <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold">默认设置</span>
               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">平台体验方向</span>
            </div>

            <div className="flex gap-2 mt-auto pt-2">
              <Button variant="outline" size="sm" className="flex-1 text-slate-600 font-semibold"><Download size={14} className="mr-1"/> 下载</Button>
              <Button variant="secondary" size="sm" className="flex-1">预览</Button>
            </div>
         </Card>

         {/* Resume Card 2 */}
         <Card className="p-6 transition-all hover:shadow-md flex flex-col gap-4 border-2 border-slate-100">
            <div className="flex justify-between items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FileText size={24} />
              </div>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16}/></button>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">产品经理_B端系统_纯文本导入版</h3>
              <div className="flex gap-4 mt-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={13}/> 2026-02-10更新</span>
                <span>纯文本</span>
              </div>
            </div>

            <div className="flex gap-2">
               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">B端方向</span>
            </div>

            <div className="flex gap-2 mt-auto pt-2">
              <Button variant="outline" size="sm" className="w-full text-slate-600 font-semibold">编辑内容</Button>
            </div>
         </Card>
      </div>
    </motion.div>
  )
}

```

## `src/views/JobLibrary.tsx`
```tsx
import React from 'react';
import { Card, Button } from '@/components/ui';
import { Plus, Building2, MoreVertical, Search, Filter } from 'lucide-react';
import * as motion from "motion/react-client";

export function JobLibrary() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">职位库</h1>
          <p className="text-slate-500 text-lg">管理你的目标职位和面试进度，集中存放 JD 和面试记录。</p>
        </div>
        <Button className="hidden md:flex gap-2 shadow-sm"><Plus size={18}/> 新增职位</Button>
      </header>

      {/* 移动端新建按钮 */}
      <Button className="md:hidden justify-center gap-2 w-full"><Plus size={18}/> 新增职位</Button>
      
      {/* 筛选与搜索 */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
         <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 min-w-[200px] flex-1 md:flex-none">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="搜索公司或职位" className="bg-transparent outline-none flex-1 text-sm font-medium" />
         </div>
         <Button variant="outline" className="shrink-0 gap-2 font-semibold rounded-full border-slate-200">
            <Filter size={16} /> 筛选状态
         </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Job Card 1 */}
        <Card className="p-6 transition-all hover:shadow-md flex flex-col gap-4 border-2 border-l-4 border-slate-100 border-l-indigo-600">
           <div className="flex justify-between items-start">
             <div className="flex flex-col gap-1.5">
               <h3 className="font-bold text-lg text-slate-900">高级交互设计师</h3>
               <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                 <Building2 size={14}/> 腾讯云 (Tencent Cloud)
               </div>
             </div>
             <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16}/></button>
           </div>
           
           <div className="flex flex-wrap gap-2">
             <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-md font-bold">一面准备中</span>
             <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-md font-medium">85% 匹配度</span>
           </div>

           <div className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl line-clamp-2 leading-relaxed">
             负责腾讯云控制台核心业务的体验设计，主导制定设计规范体系，需要有良好的全局观和复杂链路梳理能力...
           </div>

           <div className="flex gap-2 mt-auto pt-2">
             <Button variant="outline" size="sm" className="flex-1 text-slate-600 font-semibold border-slate-200">查看 JD</Button>
             <Button variant="primary" size="sm" className="flex-1 font-semibold">发起模拟面试</Button>
           </div>
        </Card>

        {/* Job Card 2 */}
        <Card className="p-6 transition-all hover:shadow-md flex flex-col gap-4 border-2 border-l-4 border-slate-100 border-l-emerald-500 bg-emerald-50/20">
           <div className="flex justify-between items-start">
             <div className="flex flex-col gap-1.5">
               <h3 className="font-bold text-lg text-slate-900">产品体验设计师 (UX)</h3>
               <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                 <Building2 size={14}/> 字节跳动 (ByteDance)
               </div>
             </div>
             <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16}/></button>
           </div>
           
           <div className="flex flex-wrap gap-2">
             <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1.5 rounded-md font-bold">已录用 (Offer)</span>
             <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-md font-medium">海外电商业务</span>
           </div>

           <div className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl line-clamp-2 leading-relaxed">
             深入理解电商用户行为，推动海外市场的购物体验本地化，与跨国团队协同工作...
           </div>

           <div className="flex gap-2 mt-auto pt-2">
             <Button variant="outline" size="sm" className="w-full text-slate-600 font-semibold border-slate-200">查看复盘报告</Button>
           </div>
        </Card>

        {/* Job Card 3 */}
        <Card className="p-6 transition-all hover:shadow-md flex flex-col gap-4 border-2 border-l-4 border-slate-100 border-l-slate-400">
           <div className="flex justify-between items-start">
             <div className="flex flex-col gap-1.5">
               <h3 className="font-bold text-lg text-slate-900">UI/UX 设计专家</h3>
               <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                 <Building2 size={14}/> 某 AI 独角兽企业
               </div>
             </div>
             <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16}/></button>
           </div>
           
           <div className="flex flex-wrap gap-2">
             <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-md font-bold">已投递</span>
           </div>

           <div className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl line-clamp-2 leading-relaxed">
             负责 AI 助手类产品的全栈体验设计，要求熟悉 AI 产品的交互范式，注重动效细节...
           </div>

           <div className="flex gap-2 mt-auto pt-2">
             <Button variant="outline" size="sm" className="flex-1 text-slate-600 font-semibold border-slate-200">查看 JD</Button>
             <Button variant="secondary" size="sm" className="flex-1 font-semibold">生成匹配分析</Button>
           </div>
        </Card>
      </div>
    </motion.div>
  )
}

```

