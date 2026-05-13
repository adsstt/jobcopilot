"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { MatchAnalysis } from "@/lib/api";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Clipboard,
  Eye,
  EyeOff,
  FileText,
  List,
  Sparkles,
  Target,
  X,
  XCircle,
} from "lucide-react";

type SectionId =
  | "section-summary"
  | "section-skills"
  | "section-resume"
  | "section-checklist"
  | "section-strategy";

type SkillStatus = "matched" | "partial" | "missing";

interface AnalysisDetailReportProps {
  analysis: MatchAnalysis;
  roleTrack: string;
  sessionId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  startInterviewHref: string;
}

interface StrategyItem {
  id: string;
  question: string;
  whyAsked: string;
  answerStrategy: string;
  evidence: string;
}

interface MatrixRow {
  requirement: string;
  evidence: string;
  note: string;
  status: SkillStatus;
}

const sections: Array<{ id: SectionId; label: string }> = [
  { id: "section-summary", label: "结论" },
  { id: "section-skills", label: "技能对标" },
  { id: "section-resume", label: "简历优化" },
  { id: "section-checklist", label: "备考清单" },
  { id: "section-strategy", label: "面试攻略" },
];

export function AnalysisDetailReport({
  analysis,
  roleTrack,
  sessionId,
  status,
  createdAt,
  updatedAt,
  startInterviewHref,
}: AnalysisDetailReportProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("section-summary");
  const [showCompactHeader, setShowCompactHeader] = useState(false);
  const [showMatchedSkills, setShowMatchedSkills] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<SectionId, boolean>>({
    "section-summary": true,
    "section-skills": false,
    "section-resume": false,
    "section-checklist": false,
    "section-strategy": false,
  });
  const [copiedId, setCopiedId] = useState("");
  const [celebratedKey, setCelebratedKey] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const capabilityAnalysis = readObject(analysis.capabilityAnalysis);
  const matchedCapabilities = readObjectArray(capabilityAnalysis?.matched);
  const partialCapabilities = readObjectArray(capabilityAnalysis?.partial);
  const missingCapabilities = readObjectArray(capabilityAnalysis?.missing);
  const cvOptimizations = readObjectArray(analysis.cvOptimization);
  const trainingPlan = readObjectArray(analysis.trainingPlan);
  const preparationAdvice = readObject(analysis.preparationAdvice);
  const interviewPreparation = readObject(analysis.interviewPreparation);
  const focusDimensions = readObjectArray(interviewPreparation?.focusDimensions);
  const likelyQuestions = readObjectArray(interviewPreparation?.likelyQuestions);
  const reverseQuestions = dedupeStrings(readStringArray(interviewPreparation?.reverseQuestions));
  const knowledgeToReview = dedupeStrings(readStringArray(preparationAdvice?.knowledgeToReview));
  const resumeChecklist = dedupeStrings(readStringArray(preparationAdvice?.resumeRevisionChecklist));
  const beforeInterview = dedupeStrings(readStringArray(preparationAdvice?.beforeInterview));
  const jdAnalysis = readObject(analysis.jdAnalysis);
  const jdKeywords = dedupeStrings(readStringArray(jdAnalysis?.jdKeywords));

  const checklistStorageKey = `analysis-checklist:${sessionId}`;
  const progressPercent = ((sections.findIndex((item) => item.id === activeSection) + 1) / sections.length) * 100;
  const activeSectionLabel = sections.find((item) => item.id === activeSection)?.label || "结论";

  const strengths = useMemo(() => dedupeStrings(analysis.strengths).slice(0, 4), [analysis.strengths]);
  const weaknesses = useMemo(() => cleanWeaknesses(analysis.weaknesses).slice(0, 4), [analysis.weaknesses]);

  const matrixRows = useMemo<MatrixRow[]>(() => {
    const rows = [
      ...matchedCapabilities.map((item) => ({
        requirement: readString(item.jdRequirement),
        evidence: readString(item.resumeEvidence) || readString(item.interviewSellingPoint) || readString(item.whyMatched),
        note: readString(item.interviewSellingPoint) || readString(item.whyMatched),
        status: "matched" as const,
      })),
      ...partialCapabilities.map((item) => ({
        requirement: readString(item.jdRequirement),
        evidence: readString(item.resumeEvidence),
        note: readString(item.gap) || readString(item.strengthenSuggestion),
        status: "partial" as const,
      })),
      ...missingCapabilities.map((item) => ({
        requirement: readString(item.jdRequirement),
        evidence: readString(item.gapDescription),
        note: readString(item.compensationStrategy),
        status: "missing" as const,
      })),
    ]
      .filter((row) => row.requirement)
      .map((row) => ({
        ...row,
        evidence: row.evidence || "当前简历里没有看到直接证据。",
        note: row.note || "建议在简历或面试里补上项目动作、结果和量化信息。",
      }));

    const unique = new Map<string, MatrixRow>();
    rows.forEach((row) => {
      if (!unique.has(row.requirement)) unique.set(row.requirement, row);
    });
    return [...unique.values()];
  }, [matchedCapabilities, missingCapabilities, partialCapabilities]);

  const missingRows = useMemo(() => matrixRows.filter((row) => row.status === "missing"), [matrixRows]);
  const partialRows = useMemo(() => matrixRows.filter((row) => row.status === "partial"), [matrixRows]);
  const matchedRows = useMemo(() => matrixRows.filter((row) => row.status === "matched"), [matrixRows]);

  const riskItems = useMemo(
    () =>
      missingCapabilities
        .map((item) => ({
          requirement: readString(item.jdRequirement),
          gap: readString(item.gapDescription),
          fix: readString(item.compensationStrategy),
          riskLevel: readString(item.riskLevel),
        }))
        .filter((item) => item.requirement || item.gap || item.fix)
        .slice(0, 3),
    [missingCapabilities]
  );

  const strategyItems = useMemo<StrategyItem[]>(() => {
    if (likelyQuestions.length > 0) {
      return likelyQuestions.slice(0, 6).map((item, index) => ({
        id: `likely-${index}`,
        question: readString(item.question) || `重点问题 ${index + 1}`,
        whyAsked: readString(item.whyAsked) || "这是岗位高概率会追问的能力验证点。",
        answerStrategy: readString(item.answerStrategy),
        evidence: readString(item.relatedResumeEvidence),
      }));
    }

    return analysis.predictedQuestions.slice(0, 6).map((question, index) => ({
      id: `predicted-${index}`,
      question,
      whyAsked: "这是 AI 判断最值得提前准备的问题方向。",
      answerStrategy: "",
      evidence: "",
    }));
  }, [analysis.predictedQuestions, likelyQuestions]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const cached = window.localStorage.getItem(checklistStorageKey);
      if (!cached) return;
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed === "object") {
        setChecklistState(parsed as Record<string, boolean>);
      }
    } catch {
      // Ignore invalid cache.
    }
  }, [checklistStorageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(checklistStorageKey, JSON.stringify(checklistState));
  }, [checklistState, checklistStorageKey]);

  useEffect(() => {
    const handleScroll = () => {
      setShowCompactHeader(window.scrollY > 240);

      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const centerA = Math.abs((a.boundingClientRect.top + a.boundingClientRect.bottom) / 2 - window.innerHeight / 2);
            const centerB = Math.abs((b.boundingClientRect.top + b.boundingClientRect.bottom) / 2 - window.innerHeight / 2);
            return centerA - centerB;
          })[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id as SectionId);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -45% 0px",
        threshold: [0.15, 0.35, 0.6],
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!copiedId) return;
    const timer = window.setTimeout(() => setCopiedId(""), 1600);
    return () => window.clearTimeout(timer);
  }, [copiedId]);

  useEffect(() => {
    if (!celebratedKey) return;
    const timer = window.setTimeout(() => setCelebratedKey(""), 600);
    return () => window.clearTimeout(timer);
  }, [celebratedKey]);

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(18);
    }
  };

  const toggleChecklist = (key: string) => {
    triggerHaptic();
    setCelebratedKey(key);
    setChecklistState((current) => ({ ...current, [key]: !current[key] }));
  };

  const toggleQuestion = (key: string) => {
    setExpandedQuestionIds((current) => ({ ...current, [key]: !current[key] }));
  };

  const toggleSection = (sectionId: SectionId) => {
    if (sectionId === "section-summary") return;
    setExpandedSections((current) => ({ ...current, [sectionId]: !current[sectionId] }));
  };

  const jumpToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    setExpandedSections((current) => ({ ...current, [sectionId]: true }));
    setMobileNavOpen(false);
    window.setTimeout(() => {
      scrollToSection(sectionId);
    }, 40);
  };

  const copyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(key);
    } catch {
      setCopiedId("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-950 [scroll-behavior:smooth]">
      <div className="fixed inset-x-0 top-0 z-[70] h-0.5 bg-transparent">
        <div className="h-full bg-indigo-500 transition-[width] duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      <CompactHeader
        visible={showCompactHeader}
        roleTrack={roleTrack}
        matchScore={analysis.matchScore}
        startInterviewHref={startInterviewHref}
      />

      <main className="mx-auto flex w-full max-w-[1560px] items-start gap-8 px-4 py-6 pb-24 md:px-8 md:pb-6 xl:px-10">
        <aside className="hidden w-56 shrink-0 xl:block" aria-hidden="true" />
        <div className="fixed left-4 top-5 z-40 hidden w-56 xl:block xl:left-[max(1rem,calc((100vw-1560px)/2+2.5rem))]">
          <nav className="max-h-[calc(100vh-2.5rem)] overflow-y-auto rounded-[24px] border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur">
            <div className="px-3 pb-3 text-xs font-bold tracking-[0.22em] text-slate-400">目录</div>
            <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold transition",
                    activeSection === section.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full transition", activeSection === section.id ? "bg-indigo-400" : "bg-slate-300")} />
                  {section.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        <div className="min-w-0 flex-1">
          <section
            id="section-summary"
            className="scroll-mt-28 rounded-[32px] border border-slate-200 bg-white px-5 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:px-8 md:py-8"
          >
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-4xl">
                <div className="text-sm font-bold uppercase tracking-[0.22em] text-indigo-600">Diagnosis Report</div>
                <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-950 md:text-5xl">{roleTrack} 诊断报告</h1>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base md:leading-8">
                  {analysis.summary || analysis.coreSummary || "暂无整体判断。"}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={startInterviewHref} className={primaryLinkClass}>
                    <Sparkles size={16} />
                    开始模拟面试
                  </a>
                  <a href="/" className={secondaryLinkClass}>
                    返回首页
                  </a>
                </div>
              </div>

              <Card className="w-full max-w-sm rounded-[28px] border-0 bg-slate-950 p-6 text-white shadow-xl">
                <div className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-200">Match Score</div>
                <div className="mt-4 flex items-end gap-3">
                  <span className="text-5xl font-bold leading-none md:text-6xl">{analysis.matchScore}%</span>
                  <span className="pb-2 text-sm font-semibold text-slate-300">{analysis.matchLevel || "综合判断"}</span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${analysis.matchScore}%` }} />
                </div>
                <div className="mt-5 space-y-2 text-sm text-slate-300">
                  <div>状态：{status}</div>
                  <div>创建时间：{createdAt}</div>
                  <div>最后更新：{updatedAt}</div>
                </div>
              </Card>
            </div>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <Card className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-none md:p-6">
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Core Signals</div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <SpotlightList
                    title="最值得放大的优势"
                    tone="emerald"
                    items={strengths}
                    icon={<CheckCircle2 size={18} />}
                    emptyText="当前没有提取到明确优势。"
                  />
                  <SpotlightList
                    title="最需要补位的短板"
                    tone="rose"
                    items={weaknesses}
                    icon={<AlertTriangle size={18} />}
                    emptyText="当前没有提取到明确短板。"
                  />
                </div>
              </Card>

              <Card className="rounded-[28px] border border-rose-100 bg-rose-50/40 p-6 shadow-none md:p-7">
                <div className="pl-1">
                  <div className="text-sm font-bold uppercase tracking-[0.18em] text-rose-500">Highest Risk</div>
                  <h2 className="mt-3 text-2xl font-bold text-slate-950">高风险缺口</h2>
                </div>
                <div className="mt-6 space-y-5">
                  {riskItems.length > 0 ? (
                    riskItems.map((item, index) => (
                      <div
                        key={`${item.requirement}-${index}`}
                        className="rounded-2xl border border-rose-100 bg-white px-5 py-5 shadow-sm"
                        style={{ borderLeft: "4px solid #EF4444" }}
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <RiskLevelBadge level={item.riskLevel} />
                          <div className="min-w-0 text-base font-bold leading-7 text-slate-950">{item.requirement || "关键风险点"}</div>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-500">{item.gap || "当前资料没有充分展示这项能力。"}</p>
                        {item.fix ? (
                          <div className="mt-4 rounded-2xl bg-[rgba(255,0,0,0.05)] px-4 py-4">
                            <div className="text-sm font-bold text-slate-900">💡 建议弥补方案</div>
                            <p className="mt-2 text-sm leading-7 text-slate-700">{item.fix}</p>
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-7 text-slate-600">当前没有解析出明确的高风险缺口，可优先围绕短板列表做针对性补强。</p>
                  )}
                </div>
              </Card>
            </div>
          </section>

          <SectionBlock
            id="section-skills"
            eyebrow="Skill Matrix"
            title="技能对标"
            description="先看缺失和部分匹配项，已匹配内容默认收起，避免一开始就被长列表淹没。"
            collapsible
            expanded={expandedSections["section-skills"]}
            onToggle={() => toggleSection("section-skills")}
          >
            <div className="space-y-4">
              {[...missingRows, ...partialRows].map((row, index) => (
                <SkillCard key={`${row.requirement}-${index}`} row={row} />
              ))}

              {matchedRows.length > 0 ? (
                <Card className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setShowMatchedSkills((current) => !current)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-950">查看其余 {matchedRows.length} 项已匹配能力</div>
                      <div className="mt-1 text-sm text-slate-500">这些能力已经基本对上，不需要占据第一屏注意力。</div>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      {showMatchedSkills ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </button>

                  {showMatchedSkills ? (
                    <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                      {matchedRows.map((row, index) => (
                        <SkillCard key={`${row.requirement}-matched-${index}`} row={row} compact />
                      ))}
                    </div>
                  ) : null}
                </Card>
              ) : null}

              {jdKeywords.length > 0 ? (
                <Card className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-bold text-slate-950">JD 关键词</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {jdKeywords.slice(0, 16).map((keyword) => (
                      <span key={keyword} className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-500">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </Card>
              ) : null}
            </div>
          </SectionBlock>

          <SectionBlock
            id="section-resume"
            eyebrow="Resume Diff"
            title="简历优化"
            description="把修改建议做成更像 Diff 的样子，重点词会被突出，方便你一眼看懂要改哪里。"
            collapsible
            expanded={expandedSections["section-resume"]}
            onToggle={() => toggleSection("section-resume")}
          >
            <div className="space-y-5">
              {cvOptimizations.slice(0, 6).map((item, index) => {
                const optimized = readString(item.optimized);
                const copyKey = `resume-${index}`;
                const title = readString(item.targetExperience) || `优化建议 ${index + 1}`;

                return (
                  <Card key={`${title}-${index}`} className="relative rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <button
                      type="button"
                      onClick={() => void copyText(copyKey, optimized)}
                      className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                    >
                      <Clipboard size={16} />
                      {copiedId === copyKey ? "已复制" : "复制"}
                    </button>

                    <div className="pr-20">
                      <div className="text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">{title}</div>
                      <h3 className="mt-2 text-xl font-bold text-slate-950">{title}</h3>
                    </div>

                    <div className="mt-5 grid gap-4 xl:grid-cols-2">
                      <DiffPanel title="原句" tone="muted" content={readString(item.original) || "未提供原句。"} />
                      <DiffPanel title="修改建议" tone="success" content={optimized || "未提供修改建议。"} highlightTerms={jdKeywords} />
                    </div>

                    {(readString(item.logic) || readString(item.missingInfoToAsk)) ? (
                      <div className="mt-4 grid gap-4 xl:grid-cols-2">
                        {readString(item.logic) ? <ContextPanel title="修改逻辑" content={readString(item.logic)} /> : null}
                        {readString(item.missingInfoToAsk) ? <ContextPanel title="还缺什么信息" content={readString(item.missingInfoToAsk)} /> : null}
                      </div>
                    ) : null}
                  </Card>
                );
              })}
            </div>
          </SectionBlock>

          <SectionBlock
            id="section-checklist"
            eyebrow="Action Checklist"
            title="备考清单"
            description="保持任务感。每勾掉一项，页面会给一点轻反馈，帮助你在长流程里维持节奏。"
            collapsible
            expanded={expandedSections["section-checklist"]}
            onToggle={() => toggleSection("section-checklist")}
          >
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <Card className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-indigo-600">
                  <Target size={16} /> 本轮准备重点
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {trainingPlan.slice(0, 4).map((item, index) => (
                    <div key={`${readString(item.title)}-${index}`} className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-sm font-bold text-slate-950">{readString(item.title) || `训练建议 ${index + 1}`}</div>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{readString(item.reason) || "建议围绕这一项做重点准备。"}</p>
                    </div>
                  ))}
                  {focusDimensions.slice(0, 4).map((item, index) => (
                    <div key={`${readString(item.dimension)}-${index}`} className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-bold text-slate-950">{readString(item.dimension) || `重点维度 ${index + 1}`}</div>
                        {readString(item.probability) ? (
                          <span className="rounded-full bg-white px-2 py-1 text-xs font-bold text-amber-700">{readString(item.probability)}</span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm leading-7 text-slate-600">
                        {readString(item.preparationStrategy) || readString(item.reason) || "建议围绕这一能力维度做针对性准备。"}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="grid gap-6">
                <ChecklistCard
                  title="面试前重点补知识"
                  tone="indigo"
                  items={knowledgeToReview.slice(0, 8).map((item, index) => ({ key: `knowledge-${index}`, label: item }))}
                  state={checklistState}
                  onToggle={toggleChecklist}
                  celebratedKey={celebratedKey}
                />
                <ChecklistCard
                  title="简历修改检查清单"
                  tone="slate"
                  items={resumeChecklist.slice(0, 6).map((item, index) => ({ key: `resume-check-${index}`, label: item }))}
                  state={checklistState}
                  onToggle={toggleChecklist}
                  celebratedKey={celebratedKey}
                />
                <ChecklistCard
                  title="临面试前动作"
                  tone="emerald"
                  items={beforeInterview.slice(0, 6).map((item, index) => ({ key: `before-${index}`, label: item }))}
                  state={checklistState}
                  onToggle={toggleChecklist}
                  celebratedKey={celebratedKey}
                />
              </div>
            </div>
          </SectionBlock>

          <SectionBlock
            id="section-strategy"
            eyebrow="Interview Strategy"
            title="面试攻略"
            description="默认只露出问题卡片。先自己想，再展开看回答思路和可用证据。"
            collapsible
            expanded={expandedSections["section-strategy"]}
            onToggle={() => toggleSection("section-strategy")}
          >
            <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <Card className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <div className="space-y-4">
                  {strategyItems.map((item, index) => {
                    const isExpanded = Boolean(expandedQuestionIds[item.id]);
                    const checklistKey = `strategy-${item.id}`;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleQuestion(item.id)}
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-100/70"
                      >
                        <div className="flex items-start gap-3">
                          <ChecklistToggle checked={Boolean(checklistState[checklistKey])} onToggle={() => toggleChecklist(checklistKey)} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-bold leading-7 text-slate-950">
                                  {index + 1}. {item.question}
                                </div>
                                <p className="mt-2 text-sm leading-7 text-slate-500">考察点：{item.whyAsked}</p>
                              </div>
                              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-slate-500">
                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                              </span>
                            </div>

                            {isExpanded ? (
                              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                                <ContextPanel
                                  title="回答思路"
                                  content={item.answerStrategy || "建议优先用 STAR 结构，先说场景和目标，再讲动作、结果和你的判断。"}
                                />
                                <ContextPanel
                                  title="可用证据"
                                  content={item.evidence || "当前接口没有给出明确证据时，建议回到简历项目里补具体动作、量化结果和你的个人贡献。"}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <ChecklistCard
                title="建议反问面试官"
                tone="amber"
                items={reverseQuestions.slice(0, 5).map((item, index) => ({ key: `reverse-${index}`, label: item }))}
                state={checklistState}
                onToggle={toggleChecklist}
                celebratedKey={celebratedKey}
                ordered
              />
            </div>
          </SectionBlock>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-4 z-[65] px-4 md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between rounded-full border border-slate-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Current</div>
            <div className="truncate text-sm font-semibold text-slate-900">{activeSectionLabel}</div>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white"
          >
            <List size={16} />
            目录
          </button>
        </div>
      </div>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-[75] bg-slate-950/35 md:hidden" onClick={() => setMobileNavOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-5 pb-8 pt-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto h-1.5 w-14 rounded-full bg-slate-200" />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">Report Map</div>
                <div className="mt-1 text-lg font-bold text-slate-950">选择章节</div>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => jumpToSection(section.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-sm font-semibold transition",
                    activeSection === section.id ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-700"
                  )}
                >
                  <span>{section.label}</span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CompactHeader({
  visible,
  roleTrack,
  matchScore,
  startInterviewHref,
}: {
  visible: boolean;
  roleTrack: string;
  matchScore: number;
  startInterviewHref: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur transition-all duration-200",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
      )}
    >
      <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-4 px-4 py-3 md:px-8 xl:px-10">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-slate-950">{roleTrack} 诊断报告</div>
          <div className="text-xs font-semibold text-slate-500">匹配度 {matchScore}%</div>
        </div>
        <a href={startInterviewHref} className={compactHeaderButtonClass}>
          <Sparkles size={15} /> 开始模拟面试
        </a>
      </div>
    </div>
  );
}

function SectionBlock({
  id,
  eyebrow,
  title,
  description,
  collapsible = false,
  expanded = true,
  onToggle,
  children,
}: {
  id: SectionId;
  eyebrow: string;
  title: string;
  description: string;
  collapsible?: boolean;
  expanded?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 pt-8">
      <div className="mb-5">
        <div className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">{eyebrow}</div>
        <h2 className="mt-2 text-2xl font-bold text-slate-950 md:text-3xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">{description}</p>
      </div>
      <div className={cn(!expanded && "hidden md:block")}>{children}</div>
      {collapsible ? (
        <div className="mt-4 md:hidden">
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
          >
            {expanded ? (
              <>
                收起
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                查看详情
                <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>
      ) : null}
    </section>
  );
}

function SpotlightList({
  title,
  tone,
  items,
  icon,
  emptyText,
}: {
  title: string;
  tone: "emerald" | "rose";
  items: string[];
  icon: React.ReactNode;
  emptyText: string;
}) {
  const toneMap = {
    emerald: "text-emerald-600 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50",
  };

  return (
    <div>
      <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold", toneMap[tone])}>
        {icon}
        {title}
      </div>
      <div className="mt-4 space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item} className="rounded-2xl bg-white px-4 py-4 text-sm font-semibold leading-7 text-slate-700 shadow-sm">
              {item}
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-500 shadow-sm">{emptyText}</div>
        )}
      </div>
    </div>
  );
}

function SkillCard({ row, compact = false }: { row: MatrixRow; compact?: boolean }) {
  const statusConfig = getStatusConfig(row.status);

  return (
    <Card
      className={cn(
        "rounded-[24px] border p-4 shadow-sm md:p-5",
        row.status === "missing" ? "border-rose-200 bg-[#FFF5F5]" : row.status === "partial" ? "border-amber-200 bg-amber-50/60" : "border-slate-200 bg-white",
        compact && "bg-slate-50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-base font-bold leading-7 text-slate-950">{row.requirement}</div>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold", statusConfig.className)}>
          {statusConfig.icon}
          {statusConfig.label}
        </span>
      </div>
      <div className="mt-3 flex items-start gap-2 text-sm leading-7 text-slate-700">
        <FileText size={16} className="mt-1 shrink-0 text-indigo-500" />
        <p>{row.evidence}</p>
      </div>
      <div className="mt-3 rounded-2xl bg-white/80 px-4 py-3 text-sm leading-7 text-slate-500">{row.note}</div>
    </Card>
  );
}

function DiffPanel({
  title,
  tone,
  content,
  highlightTerms = [],
}: {
  title: string;
  tone: "muted" | "success";
  content: string;
  highlightTerms?: string[];
}) {
  return (
    <div className={cn("rounded-[24px] p-5", tone === "muted" ? "bg-slate-50 text-slate-600" : "bg-emerald-50 text-slate-900")}>
      <div className={cn("text-xs font-bold uppercase tracking-[0.18em]", tone === "muted" ? "text-slate-400" : "text-emerald-600")}>{title}</div>
      <div className={cn("mt-3 text-sm leading-7", tone === "muted" ? "" : "font-semibold")}>
        {tone === "success" ? renderHighlightedText(content, highlightTerms) : content}
      </div>
    </div>
  );
}

function ContextPanel({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{title}</div>
      <p className="mt-2 text-sm leading-7 text-slate-600">{content}</p>
    </div>
  );
}

function ChecklistCard({
  title,
  items,
  tone,
  state,
  onToggle,
  celebratedKey,
  ordered = false,
}: {
  title: string;
  items: Array<{ key: string; label: string }>;
  tone: "indigo" | "emerald" | "amber" | "slate";
  state: Record<string, boolean>;
  onToggle: (key: string) => void;
  celebratedKey: string;
  ordered?: boolean;
}) {
  const toneMap = {
    indigo: "border-indigo-100 bg-indigo-50/40",
    emerald: "border-emerald-100 bg-emerald-50/40",
    amber: "border-amber-100 bg-amber-50/40",
    slate: "border-slate-200 bg-slate-50/70",
  };

  return (
    <Card className={cn("rounded-[28px] border p-5 shadow-sm md:p-6", toneMap[tone])}>
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      <div className="mt-5 space-y-3">
        {items.length > 0 ? (
          items.map((item, index) => {
            const checked = Boolean(state[item.key]);
            const isCelebrating = celebratedKey === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onToggle(item.key)}
                className={cn(
                  "relative flex w-full items-start gap-3 overflow-hidden rounded-2xl bg-white px-4 py-4 text-left transition hover:bg-slate-50",
                  isCelebrating && "ring-2 ring-emerald-200"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none absolute inset-0 opacity-0 transition",
                    isCelebrating && "animate-pulse bg-emerald-100/60 opacity-100"
                  )}
                />
                <ChecklistToggle checked={checked} onToggle={() => onToggle(item.key)} />
                <span className={cn("relative text-sm font-semibold leading-7 text-slate-700 transition", checked && "text-slate-400 line-through")}>
                  {ordered ? `${index + 1}. ` : ""}
                  {item.label}
                </span>
              </button>
            );
          })
        ) : (
          <div className="rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-slate-500">当前没有可展示的清单项。</div>
        )}
      </div>
    </Card>
  );
}

function ChecklistToggle({ checked, onToggle }: { checked: boolean; onToggle: () => void }) {
  return (
    <span
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      className={cn(
        "relative mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition",
        checked ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-transparent"
      )}
    >
      <Check size={14} />
    </span>
  );
}

function RiskLevelBadge({ level }: { level?: string }) {
  const normalized = (level || "高").replace("风险", "").trim();

  const config =
    normalized === "中"
      ? {
          label: "中风险",
          className: "border border-rose-200 bg-rose-50 text-rose-700",
        }
      : normalized === "低"
        ? {
            label: "低风险",
            className: "border border-slate-200 bg-white text-slate-600",
          }
        : {
            label: "高风险",
            className: "bg-rose-600 text-white shadow-sm",
          };

  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold", config.className)}>
      {config.label}
    </span>
  );
}

function renderHighlightedText(content: string, terms: string[]) {
  const validTerms = dedupeStrings(terms).filter((term) => term.length >= 2 && content.includes(term)).slice(0, 8);
  if (validTerms.length === 0) return content;

  const escaped = validTerms
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length)
    .join("|");

  const parts = content.split(new RegExp(`(${escaped})`, "g"));
  return parts.map((part, index) =>
    validTerms.includes(part) ? (
      <mark key={`${part}-${index}`} className="rounded bg-emerald-200/80 px-1 py-0.5 text-slate-900">
        {part}
      </mark>
    ) : (
      <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    )
  );
}

function getStatusConfig(status: SkillStatus) {
  return {
    matched: {
      icon: <CheckCircle2 size={14} />,
      label: "匹配",
      className: "bg-emerald-50 text-emerald-700",
    },
    partial: {
      icon: <AlertTriangle size={14} />,
      label: "部分匹配",
      className: "bg-amber-50 text-amber-700",
    },
    missing: {
      icon: <XCircle size={14} />,
      label: "缺失",
      className: "bg-rose-50 text-rose-700",
    },
  }[status];
}

function scrollToSection(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function cleanWeaknesses(items: string[]) {
  return dedupeStrings(items).filter((item) => {
    const normalized = item.replace(/\s+/g, "");
    return normalized && normalized !== "简历未体现" && normalized !== "未体现";
  });
}

function dedupeStrings(items: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];

  items.forEach((item) => {
    const value = item.trim();
    if (!value || seen.has(value)) return;
    seen.add(value);
    result.push(value);
  });

  return result;
}

function readObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readObjectArray(value: unknown) {
  return Array.isArray(value)
    ? (value.filter((item) => item && typeof item === "object" && !Array.isArray(item)) as Record<string, unknown>[])
    : [];
}

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim())
    : [];
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

const primaryLinkClass =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800";

const secondaryLinkClass =
  "inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

const compactHeaderButtonClass =
  "inline-flex h-9 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800";
