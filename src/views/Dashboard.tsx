import React, { useEffect, useMemo, useState } from "react";
import { Button, Card } from "@/components/ui";
import { ArrowUpRight, BarChart3, Briefcase, BriefcaseBusiness, CheckCircle2, Clock3, Flame, PenTool, Sparkles } from "lucide-react";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import { requestDashboardData, type DashboardData } from "@/lib/api";
import { roleTracks, toneClasses } from "@/lib/mockData";

interface DashboardProps {
  onStartInterview: () => void;
}

export function Dashboard({ onStartInterview }: DashboardProps) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    let active = true;
    requestDashboardData()
      .then((data) => {
        if (active) setDashboard(data.dashboard);
      })
      .catch(() => {
        if (active) setDashboard(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "已完成训练",
        value: String(dashboard?.stats.completedTrainings ?? 0),
        helper: dashboard ? "来自数据库记录" : "正在读取",
        icon: BarChart3,
      },
      {
        label: "平均表现",
        value: String(dashboard?.stats.averageScore ?? 0),
        helper: dashboard?.stats.averageScore ? "基于真实复盘" : "暂无复盘",
        icon: BriefcaseBusiness,
      },
      {
        label: "沉淀故事",
        value: String(dashboard?.stats.storyCount ?? 0),
        helper: dashboard?.stats.storyCount ? "来自 Story 表" : "待沉淀",
        icon: PenTool,
      },
    ],
    [dashboard]
  );

  const roleCards = dashboard?.roleSummaries.length
    ? dashboard.roleSummaries.slice(0, 3).map((role, index) => ({
        ...roleTracks[index % roleTracks.length],
        title: role.roleTrack,
        sessions: role.sessions,
        avgScore: role.avgScore,
      }))
    : [];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between md:hidden">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/100?img=33" alt="George" className="h-12 w-12 rounded-full" />
          <div className="flex flex-col">
            <span className="text-sm text-slate-500">你好</span>
            <span className="text-lg font-bold">George</span>
          </div>
        </div>
        <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm">
          <Briefcase size={20} className="text-slate-700" />
        </button>
      </div>

      <header className="flex flex-col gap-2">
        <span className="text-sm font-semibold uppercase tracking-wider text-indigo-600 md:hidden">训练方向</span>
        <h1 className="font-serif text-5xl font-medium italic tracking-tight text-slate-900 md:text-6xl">
          你好 George<br />
          <span className="text-4xl not-italic md:text-5xl">准备好开始训练了吗？</span>
        </h1>
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="flex items-center justify-between rounded-[24px] p-5">
              <div>
                <div className="text-sm font-semibold text-slate-500">{stat.label}</div>
                <div className="mt-1 text-3xl font-bold text-slate-950">{stat.value}</div>
                <div className="mt-1 text-xs font-bold text-emerald-600">{stat.helper}</div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <stat.icon size={22} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="relative flex flex-col gap-6 overflow-hidden border-0 bg-slate-900 p-8 text-white shadow-xl">
          <div className="absolute right-0 top-0 p-8 opacity-10">
            <Briefcase size={120} />
          </div>
          <div className="relative z-10 flex max-w-lg flex-col gap-4">
            <h2 className="text-3xl font-semibold">开始新的模拟面试</h2>
            <p className="text-lg text-indigo-100">选择岗位方向，上传简历和 JD，获取量身定制的面试痛点分析和预测追问。</p>
            <Button size="lg" className="mt-4 self-start bg-white text-slate-900 shadow-xl hover:bg-slate-100" onClick={onStartInterview}>
              创建练习
            </Button>
          </div>
        </Card>
      </motion.div>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">你的岗位方向</h3>
          <button className="text-sm font-semibold text-slate-500">全部方向</button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {roleCards.length ? (
            roleCards.map((role, i) => (
              <motion.div key={`${role.title}-${i}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}>
                <Card className="flex cursor-pointer flex-col gap-4 p-5 transition-transform hover:-translate-y-1 hover:shadow-md">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", toneClasses[role.tone].soft, toneClasses[role.tone].text)}>
                    <role.icon size={24} />
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{role.title}</span>
                      <span className="text-xs font-medium text-slate-500">
                        {role.sessions} 次训练 · {role.avgScore || 0} 平均分
                      </span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="col-span-2 rounded-[24px] p-5 text-sm font-semibold text-slate-500 md:col-span-3">
              暂无训练方向数据。完成一次分析后，这里会按真实 InterviewSession 聚合展示。
            </Card>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-xl font-bold">最近练习记录</h3>
        <Card className="p-6">
          {dashboard?.recentReview ? (
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-indigo-50 text-indigo-600">
                  <Sparkles size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold">{dashboard.recentReview.title}</span>
                  <span className="text-sm font-medium text-slate-500">
                    {dashboard.recentReview.lastTestedSkill || dashboard.recentReview.roleTrack} · {formatDate(dashboard.recentReview.updatedAt)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 md:items-end">
                <span className="flex items-center gap-1 self-start rounded-full bg-emerald-50 px-3 py-1 text-sm font-bold text-emerald-600 md:self-auto">
                  <CheckCircle2 size={14} /> {dashboard.recentReview.score || 0} 分 · {dashboard.recentReview.rating || "-"}
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                  <Clock3 size={13} /> 下一次建议：{dashboard.recentReview.focus.slice(0, 24)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm font-semibold text-slate-500">暂无最近练习。完成一次面试复盘后，这里会展示真实记录。</div>
          )}
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
        <Card className="rounded-[28px] p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-600">
            <Flame size={18} /> 今日 5 分钟快练
          </div>
          <h3 className="mt-3 text-2xl font-bold text-slate-950">从最近复盘里挑一个薄弱点，补齐 STAR 结构和量化结果。</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">题库真实化后，这里会自动从 Review.weaknesses 和 suggestedQuestions 里推荐专项题。</p>
          <Button variant="secondary" className="mt-5">
            开始快练
          </Button>
        </Card>
        <Card className="rounded-[28px] border-indigo-100 bg-indigo-50/60 p-6">
          <div className="text-sm font-bold text-indigo-600">故事库提醒</div>
          <div className="mt-2 text-3xl font-bold text-slate-950">{dashboard?.stats.storyCount ?? 0} 条</div>
          <p className="mt-2 text-sm leading-relaxed text-indigo-900/70">当前来自真实 Story 表。后续可把高分复盘回答一键沉淀为 STAR 故事。</p>
          <button className="mt-5 flex items-center gap-1 text-sm font-bold text-indigo-700">
            整理故事库 <ArrowUpRight size={15} />
          </button>
        </Card>
      </section>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
