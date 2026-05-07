import React, { useEffect, useMemo, useState } from "react";
import { Button, Card } from "@/components/ui";
import { generateQuestions, requestQuestions, type QuestionItem } from "@/lib/api";
import { BookOpenText, CheckCircle2, Clock3, Filter, Mic, Search, Star, RefreshCw } from "lucide-react";
import * as motion from "motion/react-client";

interface QuestionBankProps {
  onStartInterview: () => void;
}

type QuestionMark = "待练习" | "已掌握" | "重点题";
const MARK_STORAGE_KEY = "jobcopilot.questionMarks";

export function QuestionBank({ onStartInterview }: QuestionBankProps) {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [marks, setMarks] = useState<Record<string, QuestionMark>>({});
  const [query, setQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState("全部");
  const [typeFilter, setTypeFilter] = useState("全部");
  const [difficultyFilter, setDifficultyFilter] = useState("全部");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMarks(loadMarks());
    loadQuestions();
  }, []);

  const loadQuestions = () => {
    setIsLoading(true);
    setError("");
    requestQuestions()
      .then((data) => setQuestions(data.questions))
      .catch((err) => setError(err instanceof Error ? err.message : "题库加载失败"))
      .finally(() => setIsLoading(false));
  };

  const runGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const data = await generateQuestions();
      setQuestions((current) => mergeQuestions(current, data.questions));
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI 生成题目失败");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateMark = (id: string, mark: QuestionMark) => {
    const next = { ...marks, [id]: mark };
    setMarks(next);
    saveMarks(next);
  };

  const skillOptions = useMemo(() => ["全部", ...unique(questions.map((question) => question.relatedSkill))], [questions]);
  const typeOptions = useMemo(() => ["全部", ...unique(questions.map((question) => question.questionType))], [questions]);
  const difficultyOptions = ["全部", "基础", "中等", "困难"];

  const filteredQuestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return questions.filter((question) => {
      const matchesQuery =
        !normalizedQuery ||
        [question.question, question.relatedSkill, question.questionType, question.answerStrategy].some((value) => value.toLowerCase().includes(normalizedQuery));
      const matchesSkill = skillFilter === "全部" || question.relatedSkill === skillFilter;
      const matchesType = typeFilter === "全部" || question.questionType === typeFilter;
      const matchesDifficulty = difficultyFilter === "全部" || question.difficulty === difficultyFilter;
      return matchesQuery && matchesSkill && matchesType && matchesDifficulty;
    });
  }, [questions, query, skillFilter, typeFilter, difficultyFilter]);

  const summaryCards = useMemo(() => {
    const grouped = new Map<string, number>();
    for (const question of questions) grouped.set(question.relatedSkill, (grouped.get(question.relatedSkill) || 0) + 1);
    return [...grouped.entries()].slice(0, 4);
  }, [questions]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex min-w-0 flex-col gap-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Question Bank</div>
          <h1 className="font-serif text-4xl font-bold text-slate-900 md:text-5xl">岗位题库</h1>
          <p className="mt-2 text-lg text-slate-500">基于你的简历、JD、分析报告、历史面试、复盘和故事库生成个人化训练题。</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={runGenerate} disabled={isGenerating} className="gap-2 shadow-sm">
            <RefreshCw size={18} /> {isGenerating ? "生成中..." : "AI 生成题目"}
          </Button>
          <Button onClick={onStartInterview} className="gap-2 shadow-sm">
            <Mic size={18} /> 5 分钟快练
          </Button>
        </div>
      </header>

      <div className="flex min-w-0 flex-col gap-3 pb-2">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
          <Search size={18} className="text-slate-400" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
            placeholder="搜索题目、能力点或岗位方向"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="grid gap-2 md:grid-cols-3">
          <FilterSelect icon={<Filter size={16} />} value={skillFilter} onChange={setSkillFilter} options={skillOptions} />
          <FilterSelect value={typeFilter} onChange={setTypeFilter} options={typeOptions} />
          <FilterSelect value={difficultyFilter} onChange={setDifficultyFilter} options={difficultyOptions} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {summaryCards.length ? (
          summaryCards.map(([skill, count]) => (
            <Card key={skill} className="rounded-[24px] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <BookOpenText size={20} />
                </div>
                <div>
                  <div className="font-bold">{skill}</div>
                  <div className="text-xs font-medium text-slate-500">{count} 个核心追问</div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="rounded-[24px] p-4 text-sm font-semibold text-slate-500 md:col-span-4">暂无能力维度数据。</Card>
        )}
      </div>

      <div className="grid gap-4">
        {isLoading && <Card className="rounded-[28px] p-5 text-sm font-semibold text-slate-500">正在读取真实题库...</Card>}
        {!isLoading && error && <Card className="rounded-[28px] p-5 text-sm font-semibold text-rose-600">{error}</Card>}
        {!isLoading && !error && !filteredQuestions.length && (
          <Card className="rounded-[28px] p-5 text-sm font-semibold text-slate-500">暂无匹配题目。完成一次分析/面试/复盘，或点击 AI 生成题目。</Card>
        )}
        {!isLoading &&
          !error &&
          filteredQuestions.map((question, index) => (
            <motion.div key={question.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.025 }}>
              <Card className="min-w-0 rounded-[28px] p-5 transition-all hover:border-indigo-200 hover:shadow-md">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <BookOpenText size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{question.questionType}</span>
                        <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">{question.relatedSkill}</span>
                        <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">{question.difficulty}</span>
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{marks[question.id] || "待练习"}</span>
                      </div>
                      <h3 className="mt-3 break-words text-lg font-bold text-slate-950">{question.question}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{question.answerStrategy}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock3 size={13} /> {question.askedCount ? `已问过 ${question.askedCount} 次` : "尚未正式追问"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star size={13} /> 来源：{sourceLabel(question.source)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex min-w-0 flex-col gap-2 md:min-w-[240px]">
                    <div className="grid grid-cols-3 gap-2">
                      {(["待练习", "已掌握", "重点题"] as QuestionMark[]).map((mark) => (
                        <Button key={mark} size="sm" variant={marks[question.id] === mark ? "secondary" : "outline"} onClick={() => updateMark(question.id, mark)}>
                          {mark}
                        </Button>
                      ))}
                    </div>
                    <Button onClick={onStartInterview} size="sm" variant="secondary">
                      练习
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
      </div>

      <Card className="rounded-[28px] border-emerald-100 bg-emerald-50/70 p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 text-emerald-600" size={20} />
          <div>
            <h3 className="font-bold text-slate-950">题库会和复盘、故事库联动</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              题目会从分析报告、真实问过的问题、复盘训练重点和高频故事中生成；你的本地标记会保留在当前浏览器中。
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function FilterSelect({
  icon,
  value,
  options,
  onChange,
}: {
  icon?: React.ReactNode;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
      {icon}
      <select className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function loadMarks(): Record<string, QuestionMark> {
  try {
    const parsed = JSON.parse(localStorage.getItem(MARK_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveMarks(marks: Record<string, QuestionMark>) {
  localStorage.setItem(MARK_STORAGE_KEY, JSON.stringify(marks));
}

function mergeQuestions(current: QuestionItem[], generated: QuestionItem[]) {
  const ids = new Set(current.map((question) => question.id));
  return [...generated.filter((question) => !ids.has(question.id)), ...current];
}

function sourceLabel(source: string) {
  if (source === "analysis.suggestedQuestions") return "分析报告";
  if (source === "analysis.interviewPreparation") return "面试准备";
  if (source === "interview.message") return "历史面试";
  if (source === "review.nextTrainingFocus") return "复盘重点";
  if (source === "story.highFrequency") return "故事库";
  if (source === "ai_generated") return "AI 生成";
  return source;
}
