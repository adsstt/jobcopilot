"use client";

import React, { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import { requestInterviewReviews, saveStory, type InterviewReviewSummary } from "@/lib/api";
import { ArrowUpRight, CheckCircle2, Library, Sparkles, TrendingUp } from "lucide-react";
import * as motion from "motion/react-client";

interface ReviewsViewProps {
  onOpenQuestions: () => void;
}

export function ReviewsView({ onOpenQuestions }: ReviewsViewProps) {
  const [reviewReports, setReviewReports] = useState<InterviewReviewSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingStoryId, setSavingStoryId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const latestRealSample = reviewReports.find((report) => report.sampleOriginalAnswer && report.sampleImprovedAnswer) || null;

  useEffect(() => {
    let active = true;
    requestInterviewReviews()
      .then((data) => {
        if (active) setReviewReports(data.reviews);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "复盘记录加载失败");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const saveReportStory = async (report: InterviewReviewSummary) => {
    setSavingStoryId(report.id);
    setError("");
    setNotice("");
    try {
      await saveStory({
        title: `${report.roleTrack} 复盘故事：${report.title}`,
        background: `来源于 ${formatReviewDate(report.date)} 的模拟面试复盘。`,
        task: report.focus || "根据复盘内容补齐面试表达任务。",
        action: `训练标签：${report.tags.join("、") || report.roleTrack}。建议继续补充原始回答、关键动作和量化结果。`,
        result: report.score ? `本次复盘得分 ${report.score}，评级 ${report.rating || "未评级"}。` : "本次复盘已沉淀，后续可继续补充结果指标。",
        relatedSkill: report.tags[1] || report.roleTrack || "复盘表达",
        relatedJDKeywords: report.tags.slice(0, 5),
        confidenceScore: Math.max(50, Math.min(95, report.score || 70)),
        isHighFrequency: true,
        source: "review",
      });
      setNotice("已保存到故事库。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存到故事库失败");
    } finally {
      setSavingStoryId("");
    }
  };

  const saveSampleStory = async () => {
    setSavingStoryId("sample");
    setError("");
    setNotice("");
    const sample = latestRealSample;
    try {
      await saveStory({
        title: sample ? `${sample.roleTrack} 回答重塑样例` : "把技术重构讲成业务恢复",
        background: sample?.sampleOriginalQuestion || "旧框架导致移动端关键页面性能下降，并影响转化表现。",
        task: sample?.sampleOriginalAnswer || "在不影响业务连续性的前提下，完成 React 渐进迁移并恢复页面体验。",
        action: sample?.sampleImprovedAnswer || "主导迁移方案设计，采用新老页面共存和核心链路逐步替换，降低上线风险。",
        result: sample?.sampleWhyBetter || "3 个月内将 FCP 提升 40%，同时保障业务零停机迭代。",
        relatedSkill: sample?.tags[1] || "业务影响力表达",
        relatedJDKeywords: sample?.tags?.slice(0, 5) || ["技术重构", "性能优化", "业务指标"],
        confidenceScore: sample?.score ? Math.max(50, Math.min(95, sample.score)) : 82,
        isHighFrequency: true,
        source: "review",
      });
      setNotice(sample ? "最近一次真实重塑样例已保存到故事库。" : "样例已保存到故事库。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存到故事库失败");
    } finally {
      setSavingStoryId("");
    }
  };

  const sampleHeadline = latestRealSample ? `来自 ${latestRealSample.roleTrack} 最近一次复盘的回答重塑` : "把“做了重构”变成“推动业务恢复”";
  const sampleDescription = latestRealSample
    ? `基于 ${formatReviewDate(latestRealSample.date)} 的真实复盘结果，沉淀可复用的表达版本。`
    : "复盘不只给分，而是沉淀可复制的表达框架。";
  const sampleOriginalAnswer = latestRealSample?.sampleOriginalAnswer || "我负责把旧框架迁移到 React，主要解决性能问题。";
  const sampleImprovedAnswer =
    latestRealSample?.sampleImprovedAnswer ||
    "旧框架导致移动端转化率流失约 30%。我主导 React 迁移并设计渐进替换方案，3 个月内将 FCP 提升 40%，同时保障业务零停机迭代。";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <header>
        <div className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Reviews</div>
        <h1 className="font-serif text-4xl font-bold text-slate-900 md:text-5xl">复盘与能力趋势</h1>
        <p className="mt-2 max-w-2xl text-lg leading-relaxed text-slate-500">把每次模拟后的问题、重塑回答和下一步训练建议沉淀下来。</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-[28px] bg-slate-900 p-6 text-white md:col-span-2">
          <div className="flex items-center gap-2 text-sm font-bold text-indigo-200">
            <TrendingUp size={18} /> 近 7 天能力变化
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Trend label="表达结构" value="+12%" />
            <Trend label="岗位匹配" value="+8%" />
            <Trend label="抗压追问" value="+5%" />
          </div>
          <div className="mt-6 h-28 rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-full items-end gap-3">
              {[42, 58, 52, 70, 66, 78, 88].map((height, index) => (
                <div key={index} className="flex-1 rounded-t-2xl bg-indigo-400/80" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </Card>
        <Card className="rounded-[28px] border-indigo-100 bg-indigo-50 p-6">
          <div className="text-sm font-bold text-indigo-700">本周最该补强</div>
          <h3 className="mt-3 text-2xl font-bold text-slate-950">业务影响力表达</h3>
          <p className="mt-2 text-sm leading-relaxed text-indigo-900/70">你能讲清做了什么，但还需要补充指标、成本、收益和决策链路。</p>
          <Button className="mt-5 w-full" onClick={onOpenQuestions}>生成专项训练</Button>
        </Card>
      </div>

      <div className="grid gap-4">
        {isLoading && (
          <Card className="rounded-[28px] p-6 text-sm font-semibold text-slate-500">正在加载历史复盘...</Card>
        )}
        {!isLoading && error && (
          <Card className="rounded-[28px] p-6 text-sm font-semibold text-rose-600">{error}</Card>
        )}
        {notice && (
          <Card className="rounded-[28px] border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">{notice}</Card>
        )}
        {!isLoading && !error && !reviewReports.length && (
          <Card className="rounded-[28px] p-6 text-sm font-semibold text-slate-500">暂无历史复盘。完成一次模拟面试后，这里会显示真实数据库记录。</Card>
        )}
        {!isLoading && !error && reviewReports.map((report, index) => (
          <motion.div key={report.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="rounded-[28px] p-6 transition-all hover:border-indigo-200 hover:shadow-md">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-500">{formatReviewDate(report.date)}</div>
                    <h3 className="mt-1 text-xl font-bold text-slate-950">{report.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{report.focus}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {report.tags.map((tag) => (
                        <span key={tag} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:min-w-[180px] md:justify-end">
                  <div className="text-right">
                    <div className="font-serif text-5xl font-bold text-slate-950">{report.rating || "-"}</div>
                    <div className="text-sm font-bold text-emerald-600">{report.score} 分</div>
                  </div>
                  <Button variant="outline" size="icon">
                    <ArrowUpRight size={20} />
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => void saveReportStory(report)} disabled={savingStoryId === report.id}>
                    <Library size={15} /> {savingStoryId === report.id ? "保存中" : "存故事"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="rounded-[28px] p-6">
        <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
              <Sparkles size={18} /> 回答重塑样例
            </div>
            <h3 className="mt-3 text-2xl font-bold text-slate-950">{sampleHeadline}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{sampleDescription}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <div className="rounded-2xl bg-white p-4 text-sm italic text-slate-600 shadow-sm">“{sampleOriginalAnswer}”</div>
            <div className="my-3 flex justify-center">
              <div className="rounded-full bg-indigo-600 p-2 text-white"><Sparkles size={16} /></div>
            </div>
            <div className="rounded-2xl bg-indigo-600 p-4 text-sm font-medium leading-relaxed text-white">
              “{sampleImprovedAnswer}”
            </div>
            <Button variant="outline" className="mt-4 w-full gap-2" onClick={() => void saveSampleStory()} disabled={savingStoryId === "sample"}>
              <Library size={16} /> {savingStoryId === "sample" ? "保存中..." : "保存到故事库"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function formatReviewDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Trend({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/10 p-4">
      <div className="text-sm text-slate-300">{label}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}
