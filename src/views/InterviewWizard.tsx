import React, { useState } from "react";
import { Button, Card } from "@/components/ui";
import { roleTracks, toneClasses } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { requestAnalysis, requestInterviewMessage, requestInterviewMessageStream, requestSessionReview, type FullReviewResult, type InterviewMessageResponse, type InterviewTurn, type MatchAnalysis } from "@/lib/api";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  FileText,
  Image as ImageIcon,
  Library,
  Mic,
  Pause,
  Play,
  Sparkles,
  Square,
  Target,
  Type,
  UploadCloud,
} from "lucide-react";
import * as motion from "motion/react-client";

type Step = "upload" | "analyze" | "interview" | "review";

interface WizardProps {
  onComplete: () => void;
}

const stepLabels: Record<Step, string> = {
  upload: "第一步：准备阶段",
  analyze: "第二步：智能分析",
  interview: "第三步：模拟面试",
  review: "第四步：深度复盘",
};

function replaceLastAiMessage(history: InterviewTurn[], content: string): InterviewTurn[] {
  const next = [...history];
  for (let index = next.length - 1; index >= 0; index -= 1) {
    if (next[index].role === "ai") {
      next[index] = { ...next[index], content };
      return next;
    }
  }
  return [...next, { role: "ai", content }];
}

function getFirstImprovedAnswer(review: FullReviewResult) {
  const first = review.improvedAnswerExamples?.[0];
  const value = first?.improvedAnswer;
  return typeof value === "string" ? value : "";
}

export function InterviewWizard({ onComplete }: WizardProps) {
  const [step, setStep] = useState<Step>("upload");
  const [selectedTrackId, setSelectedTrackId] = useState("frontend");
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [analysis, setAnalysis] = useState<MatchAnalysis | null>(null);
  const [history, setHistory] = useState<InterviewTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [lastEvaluation, setLastEvaluation] = useState<InterviewMessageResponse["evaluation"] | null>(null);
  const [fullReview, setFullReview] = useState<FullReviewResult | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");
  const selectedTrack = roleTracks.find((track) => track.id === selectedTrackId) ?? roleTracks[0];

  const goBack = () => {
    if (step === "upload") {
      onComplete();
      return;
    }
    if (step === "review") setStep("interview");
    if (step === "interview") setStep("analyze");
    if (step === "analyze") setStep("upload");
  };

  const runAnalysis = async () => {
    setIsWorking(true);
    setError("");
    try {
      const result = await requestAnalysis({
        roleTrack: selectedTrack.title,
        resumeText,
        jdText,
        resumeFile,
        jdFile,
      });
      setSessionId(result.sessionId);
      setAnalysis(result);
      setStep("analyze");
    } catch (err) {
      setError(err instanceof Error ? err.message : "分析失败，请稍后重试。");
    } finally {
      setIsWorking(false);
    }
  };

  const startInterview = async () => {
    setIsWorking(true);
    setError("");
    try {
      const result = await requestInterviewMessage({
        sessionId,
        roleTrack: selectedTrack.title,
        resumeText,
        jdText,
        analysis,
        history: [],
      });
      setSessionId(result.sessionId || sessionId);
      setCurrentQuestion(result.nextQuestion);
      setLastEvaluation(result.evaluation);
      setHistory([{ role: "ai", content: result.nextQuestion }]);
      setStep("interview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成面试问题失败，请稍后重试。");
    } finally {
      setIsWorking(false);
    }
  };

  const submitAnswer = async (answer: string) => {
    setIsWorking(true);
    setError("");
    const userTurn: InterviewTurn = { role: "user", content: answer };
    const aiTurn: InterviewTurn = { role: "ai", content: "正在思考..." };
    const historyWithPendingAi: InterviewTurn[] = [...history, userTurn, aiTurn];
    const requestHistory: InterviewTurn[] = [...history, userTurn];
    let streamedText = "";

    setHistory(historyWithPendingAi);
    try {
      await requestInterviewMessageStream(
        {
          sessionId,
          roleTrack: selectedTrack.title,
          resumeText,
          jdText,
          analysis,
          history: requestHistory,
          answer,
        },
        {
          onDelta: (text) => {
            streamedText += text;
            setHistory((current) => replaceLastAiMessage(current, streamedText || "正在思考..."));
            setCurrentQuestion(streamedText);
          },
          onDone: (result) => {
            setSessionId(result.sessionId || sessionId);
            setLastEvaluation(result.evaluation);
            setCurrentQuestion(result.nextQuestion);
            setHistory((current) => replaceLastAiMessage(current, result.nextQuestion));
          },
          onError: (message) => setError(message),
        }
      );
    } catch (err) {
      try {
        const result = await requestInterviewMessage({
          sessionId,
          roleTrack: selectedTrack.title,
          resumeText,
          jdText,
          analysis,
          history: requestHistory,
          answer,
        });
        setSessionId(result.sessionId || sessionId);
        setLastEvaluation(result.evaluation);
        setCurrentQuestion(result.nextQuestion);
        setHistory([...requestHistory, { role: "ai", content: result.nextQuestion }]);
      } catch (fallbackErr) {
        setHistory(requestHistory);
        setError(fallbackErr instanceof Error ? fallbackErr.message : err instanceof Error ? err.message : "提交回答失败，请稍后重试。");
      }
    } finally {
      setIsWorking(false);
    }
  };

  const enterReview = async () => {
    setStep("review");
    setError("");
    if (!sessionId) return;

    setIsReviewLoading(true);
    try {
      const result = await requestSessionReview(sessionId);
      setFullReview(result.review);
      setLastEvaluation((current) => ({
        score: result.review.overallScore,
        summary: result.review.summary,
        strengths: result.review.strengths,
        improvements: result.review.weaknesses,
        rewrittenAnswer: getFirstImprovedAnswer(result.review) || current?.rewrittenAnswer || "",
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "复盘生成失败，请稍后重试。");
    } finally {
      setIsReviewLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col">
      <header className="flex items-center justify-between pb-8">
        <button
          onClick={goBack}
          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-sm transition-colors hover:bg-slate-50"
        >
          <ChevronLeft size={24} className="text-slate-700" />
        </button>
        <div className="text-center">
          <span className="text-sm font-semibold tracking-widest text-slate-500">{stepLabels[step]}</span>
          <div className="mt-2 hidden gap-1 md:flex">
            {(["upload", "analyze", "interview", "review"] as Step[]).map((item) => (
              <div key={item} className={cn("h-1.5 w-10 rounded-full", item === step ? "bg-indigo-600" : "bg-slate-200")} />
            ))}
          </div>
        </div>
        <div className="w-12" />
      </header>

      <div className="flex-1">
        {step === "upload" && (
          <UploadStep
            selectedTrackId={selectedTrackId}
            onTrackChange={setSelectedTrackId}
            resumeText={resumeText}
            jdText={jdText}
            resumeFile={resumeFile}
            jdFile={jdFile}
            onResumeTextChange={setResumeText}
            onJdTextChange={setJdText}
            onResumeFileChange={setResumeFile}
            onJdFileChange={setJdFile}
            onNext={runAnalysis}
            isLoading={isWorking}
            error={error}
          />
        )}
        {step === "analyze" && <AnalyzeStep track={selectedTrack} analysis={analysis} onNext={startInterview} isLoading={isWorking} error={error} />}
        {step === "interview" && (
          <InterviewStep
            track={selectedTrack}
            question={currentQuestion}
            history={history}
            evaluation={lastEvaluation}
            isLoading={isWorking}
            error={error}
            onSubmitAnswer={submitAnswer}
            onNext={enterReview}
          />
        )}
        {step === "review" && <ReviewStep track={selectedTrack} evaluation={lastEvaluation} fullReview={fullReview} isLoading={isReviewLoading} error={error} onFinish={onComplete} />}
      </div>
    </div>
  );
}

function UploadStep({
  selectedTrackId,
  onTrackChange,
  resumeText,
  jdText,
  resumeFile,
  jdFile,
  onResumeTextChange,
  onJdTextChange,
  onResumeFileChange,
  onJdFileChange,
  onNext,
  isLoading,
  error,
}: {
  selectedTrackId: string;
  onTrackChange: (id: string) => void;
  resumeText: string;
  jdText: string;
  resumeFile: File | null;
  jdFile: File | null;
  onResumeTextChange: (value: string) => void;
  onJdTextChange: (value: string) => void;
  onResumeFileChange: (file: File | null) => void;
  onJdFileChange: (file: File | null) => void;
  onNext: () => Promise<void>;
  isLoading: boolean;
  error: string;
}) {
  const [resumeMode, setResumeMode] = useState<"file" | "text">("file");
  const [jdMode, setJdMode] = useState<"text" | "file">("text");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <div>
        <h2 className="mb-2 font-serif text-4xl font-bold text-slate-900 md:text-5xl">设定目标岗位</h2>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-500">选择训练方向，再上传简历和 JD。电脑端与手机端都可以完成完整准备流程。</p>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        {roleTracks.map((track) => {
          const tone = toneClasses[track.tone];
          const active = selectedTrackId === track.id;
          return (
            <button
              key={track.id}
              onClick={() => onTrackChange(track.id)}
              className={cn(
                "rounded-[24px] border-2 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                active ? `${tone.border} ring-4 ring-indigo-500/10` : "border-slate-100"
              )}
            >
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", tone.soft, tone.text)}>
                <track.icon size={22} />
              </div>
              <div className="mt-3 font-bold text-slate-950">{track.title}</div>
              <div className="mt-1 text-xs font-medium text-slate-500">{track.subtitle}</div>
            </button>
          );
        })}
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <UploadCard
          tone="indigo"
          icon={<FileText size={24} />}
          title="你的简历"
          helper="用于提取项目经历、能力证据和可复用故事。"
          mode={resumeMode}
          onModeChange={setResumeMode}
          fileLabel="点击或拖拽上传简历"
          textPlaceholder="在此处粘贴你的简历纯文本..."
          textValue={resumeText}
          file={resumeFile}
          onTextChange={onResumeTextChange}
          onFileChange={onResumeFileChange}
        />
        <UploadCard
          tone="emerald"
          icon={<Target size={24} />}
          title="职位描述 (JD)"
          helper="用于对齐岗位要求、预测面试焦点和追问路径。"
          mode={jdMode}
          onModeChange={setJdMode}
          fileLabel="上传岗位要求截图或文件"
          textPlaceholder="在此处粘贴职位描述文本..."
          textValue={jdText}
          file={jdFile}
          onTextChange={onJdTextChange}
          onFileChange={onJdFileChange}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <Card className="rounded-[24px] border-indigo-100 bg-indigo-50/70 p-5">
          <div className="text-sm font-bold text-indigo-700">资料完整度</div>
          <p className="mt-1 text-sm leading-relaxed text-indigo-900/70">简历和 JD 都提供时，将生成完整人岗匹配分析；只提供其一也可开始基础分析。</p>
          {error && <p className="mt-3 text-sm font-bold text-rose-600">{error}</p>}
        </Card>
        <Button size="lg" className="w-full shadow-xl md:w-auto" onClick={onNext} disabled={isLoading}>
          {isLoading ? "正在分析..." : "开始完整分析"}
        </Button>
      </div>
    </motion.div>
  );
}

function UploadCard({
  tone,
  icon,
  title,
  helper,
  mode,
  onModeChange,
  fileLabel,
  textPlaceholder,
  textValue,
  file,
  onTextChange,
  onFileChange,
}: {
  tone: "indigo" | "emerald";
  icon: React.ReactNode;
  title: string;
  helper: string;
  mode: "file" | "text";
  onModeChange: (mode: "file" | "text") => void;
  fileLabel: string;
  textPlaceholder: string;
  textValue: string;
  file: File | null;
  onTextChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
}) {
  const activeClasses = tone === "indigo" ? "ring-indigo-500/20 focus:border-indigo-500" : "ring-emerald-500/20 focus:border-emerald-500";
  const iconClasses = tone === "indigo" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600";
  const hoverClasses = tone === "indigo" ? "hover:border-indigo-300 hover:text-indigo-600" : "hover:border-emerald-300 hover:text-emerald-600";

  return (
    <Card className="flex flex-col gap-4 border-2 border-slate-100 p-6 transition-colors hover:border-slate-200">
      <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", iconClasses)}>{icon}</div>
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{helper}</p>
      </div>
      <div className="mt-2 flex w-fit rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => onModeChange("file")}
          className={cn("flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors", mode === "file" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500")}
        >
          <UploadCloud size={16} /> 文件/图片
        </button>
        <button
          onClick={() => onModeChange("text")}
          className={cn("flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors", mode === "text" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500")}
        >
          <Type size={16} /> 粘贴文本
        </button>
      </div>

      {mode === "file" ? (
        <label className={cn("group mt-2 flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 transition-all hover:bg-slate-100", hoverClasses)}>
          <input
            className="hidden"
            type="file"
            accept=".pdf,.docx,.txt,image/png,image/jpeg"
            onChange={(event) => onFileChange(event.target.files?.[0] || null)}
          />
          <UploadCloud size={32} className="transition-transform group-hover:scale-110" />
          <span className="max-w-full px-4 text-center font-semibold text-slate-700">{file?.name || fileLabel}</span>
          <span className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <FileText size={14} /> PDF / Word
            <ImageIcon size={14} className="ml-1" /> 图片/截图
          </span>
        </label>
      ) : (
        <textarea
          className={cn("mt-2 min-h-[160px] w-full flex-1 resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2", activeClasses)}
          placeholder={textPlaceholder}
          value={textValue}
          onChange={(event) => onTextChange(event.target.value)}
        />
      )}
    </Card>
  );
}

function AnalyzeStep({
  track,
  analysis,
  onNext,
  isLoading,
  error,
}: {
  track: typeof roleTracks[number];
  analysis: MatchAnalysis | null;
  onNext: () => Promise<void>;
  isLoading: boolean;
  error: string;
}) {
  const matchScore = analysis?.matchScore ?? track.match;
  const strengths = analysis?.strengths?.length ? analysis.strengths : track.abilities.map((ability) => `${ability.label} 表现较好，可作为回答支点。`);
  const questions = analysis?.predictedQuestions?.length ? analysis.predictedQuestions : track.questions;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-8">
      <div>
        <h2 className="mb-2 font-serif text-4xl font-bold text-slate-900 md:text-5xl">分析完成</h2>
        <p className="text-lg text-slate-500">{analysis?.summary || `以下是你的资料与「${track.title}」方向的匹配情况。`}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-4 border-0 bg-slate-900 p-8 text-white md:col-span-1">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-indigo-500/30">
            <span className="text-4xl font-bold">{matchScore}%</span>
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="72" cy="72" r="64" fill="none" stroke="currentColor" strokeWidth="8" className="text-indigo-500" strokeDasharray="402" strokeDashoffset="52" />
            </svg>
          </div>
          <span className="text-lg font-semibold">岗位方向匹配度</span>
          <p className="text-center text-sm text-slate-300">{track.nextFocus}</p>
        </Card>

        <div className="grid gap-6 md:col-span-2">
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-emerald-600">
              <CheckCircle2 size={20} /> 核心优势
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {strengths.slice(0, 4).map((strength) => (
                <div key={strength} className="rounded-2xl bg-emerald-50/60 p-4">
                  <div className="text-sm font-bold leading-relaxed text-slate-950">{strength}</div>
                </div>
              ))}
            </div>
          </Card>
          {analysis?.weaknesses?.length ? (
            <Card className="p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-rose-600">
                <AlertTriangle size={20} /> 关键短板
              </h3>
              <div className="space-y-3">
                {analysis.weaknesses.slice(0, 4).map((weakness) => (
                  <div key={weakness} className="rounded-2xl bg-rose-50/70 p-4 text-sm font-semibold leading-relaxed text-slate-700">
                    {weakness}
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
          <Card className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-600">
              <AlertTriangle size={20} /> 预测高频追问
            </h3>
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={question} className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                  {index + 1}. {question}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {error && <p className="text-sm font-bold text-rose-600">{error}</p>}
      <Button size="lg" className="w-full shadow-xl md:w-auto md:self-end" onClick={onNext} disabled={isLoading}>
        {isLoading ? "正在生成第一题..." : "开始模拟面试"}
      </Button>
    </motion.div>
  );
}

function InterviewStep({
  track,
  question,
  history,
  evaluation,
  isLoading,
  error,
  onSubmitAnswer,
  onNext,
}: {
  track: typeof roleTracks[number];
  question: string;
  history: InterviewTurn[];
  evaluation: InterviewMessageResponse["evaluation"] | null;
  isLoading: boolean;
  error: string;
  onSubmitAnswer: (answer: string) => Promise<void>;
  onNext: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [answer, setAnswer] = useState("");

  const submit = async () => {
    if (!answer.trim()) return;
    await onSubmitAnswer(answer);
    setAnswer("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 pb-8">
      <div className="grid gap-5 lg:grid-cols-[240px_1fr_280px]">
        <Card className="hidden rounded-[28px] p-5 lg:block">
          <div className="text-sm font-bold text-slate-500">当前考点</div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Target size={21} />
            </div>
            <div>
              <div className="font-bold text-slate-950">{track.abilities[0].label}</div>
              <div className="text-xs font-medium text-slate-500">{track.title}</div>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {track.abilities.map((ability) => (
              <div key={ability.label} className="rounded-2xl bg-slate-50 p-3">
                <div className="text-xs font-bold text-slate-500">{ability.label}</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-indigo-600" style={{ width: `${ability.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="relative flex min-h-[560px] flex-col items-center justify-between overflow-hidden rounded-[32px] border-indigo-100 bg-white/80 p-6 text-center backdrop-blur">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-indigo-50 to-transparent" />
          <div className="relative z-10 flex flex-col items-center gap-4 pt-10">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-indigo-50 shadow-inner">
              <div className="absolute inset-0 rounded-full bg-indigo-100 opacity-20 animate-ping" />
              <Sparkles size={52} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI 面试官</h2>
              <p className="text-slate-500">{isRecording ? "正在记录你的回答..." : "正在倾听，准备追问"}</p>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-100 bg-slate-50 p-5 text-left shadow-sm">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Question</div>
            <p className="mt-3 text-base font-semibold leading-relaxed text-slate-800">
              {question || "请先用 2-3 分钟介绍一个最能代表你岗位能力的项目，重点说明背景、你的职责、关键行动和结果。"}
            </p>
            <textarea
              className="mt-4 min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="MVP 阶段可先输入文字回答；后续这里会接入 ASR 语音转写。"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
            {evaluation?.summary && (
              <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-sm font-medium leading-relaxed text-emerald-800">
                上轮反馈：{evaluation.summary}
              </div>
            )}
            {error && <div className="mt-3 text-sm font-bold text-rose-600">{error}</div>}
          </div>

          <div className="relative z-10 flex items-center justify-center gap-5">
            <Button variant="outline" size="icon" className="h-14 w-14 text-slate-500">
              <Pause size={22} />
            </Button>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={cn(
                "flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all duration-300",
                isRecording ? "scale-110 bg-red-500 ring-8 ring-red-500/20" : "bg-slate-900 hover:scale-105 hover:bg-slate-800"
              )}
            >
              {isRecording ? <Square size={30} className="text-white" fill="currentColor" /> : <Mic size={40} className="text-white" />}
            </button>
            <Button variant="outline" size="icon" className="h-14 w-14 bg-white text-slate-900 shadow-sm" onClick={onNext}>
              <CheckCircle2 size={22} />
            </Button>
          </div>
          <Button className="relative z-10 w-full max-w-lg" onClick={submit} disabled={isLoading || !answer.trim()}>
            {isLoading ? "正在生成反馈..." : "提交回答并生成下一题"}
          </Button>
        </Card>

        <Card className="rounded-[28px] p-5">
          <div className="flex items-center justify-between">
            <div className="font-bold text-slate-950">实时记录</div>
            <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">Live</span>
          </div>
          <div className="mt-5 space-y-4">
            {(history.length ? history : [{ role: "ai" as const, content: question || "请先用 2-3 分钟回答，不用追求完美，我会根据你的回答继续深挖。" }]).slice(-5).map((turn, index) => (
              <div key={`${turn.role}-${index}`}>
                <Message who={turn.role === "ai" ? "AI" : "你"} text={turn.content} muted={turn.role === "user"} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

function Message({ who, text, muted }: { who: string; text: string; muted?: boolean }) {
  return (
    <div className={cn("rounded-2xl p-3 text-sm leading-relaxed", muted ? "bg-slate-50 text-slate-500" : "bg-indigo-50 text-slate-800")}>
      <div className="mb-1 text-xs font-bold text-slate-400">{who}</div>
      {text}
    </div>
  );
}

function ReviewStep({
  track,
  evaluation,
  fullReview,
  isLoading,
  error,
  onFinish,
}: {
  track: typeof roleTracks[number];
  evaluation: InterviewMessageResponse["evaluation"] | null;
  fullReview: FullReviewResult | null;
  isLoading: boolean;
  error: string;
  onFinish: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <div>
        <h2 className="mb-2 font-serif text-4xl font-bold text-slate-900 md:text-5xl">深度复盘报告</h2>
        <p className="text-lg text-slate-500">
          {isLoading ? "正在基于整场面试生成复盘..." : `基于「${track.title}」方向的实际表现生成回答重塑和下一步训练建议。`}
        </p>
        {error && <p className="mt-3 text-sm font-bold text-rose-600">{error}</p>}
      </div>

      <Card className="flex flex-col gap-8 overflow-hidden border-0 bg-slate-900 p-8 text-white md:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-sm font-semibold tracking-widest text-indigo-200">综合评级</span>
          <span className="font-serif text-7xl font-bold leading-none">{fullReview?.overallScore || evaluation?.score || "A-"}</span>
          <p className="mt-4 text-lg text-slate-300">{fullReview?.summary || evaluation?.summary || "你回答技术问题的逻辑框架很稳。要拿到更高分，需要补充业务影响力、衡量指标和方案取舍。"}</p>
        </div>
        <div className="rounded-3xl bg-white/10 p-6 md:w-72">
          <div className="text-sm font-semibold">核心素质表现</div>
          <Score label="沟通与表达" value={fullReview?.overallScore || 92} />
          <Score label={track.abilities[0].label} value={fullReview?.overallScore ? Math.max(fullReview.overallScore - 4, 0) : 88} />
          <Score label="业务影响力" value={fullReview?.overallScore ? Math.max(fullReview.overallScore - 10, 0) : 74} />
        </div>
      </Card>

      {fullReview && (
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-[28px] p-6">
            <h3 className="text-lg font-bold text-emerald-700">整场优势</h3>
            <div className="mt-4 space-y-3">
              {fullReview.strengths.slice(0, 3).map((item) => (
                <div key={item} className="rounded-2xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-900">{item}</div>
              ))}
            </div>
          </Card>
          <Card className="rounded-[28px] p-6">
            <h3 className="text-lg font-bold text-rose-700">待提升点</h3>
            <div className="mt-4 space-y-3">
              {fullReview.weaknesses.slice(0, 3).map((item) => (
                <div key={item} className="rounded-2xl bg-rose-50 p-3 text-sm font-semibold text-rose-900">{item}</div>
              ))}
            </div>
          </Card>
        </section>
      )}

      <section>
        <h3 className="mb-4 text-xl font-bold">回答重塑：从原话到高分模板</h3>
        <Card className="flex flex-col gap-4 border-indigo-100 bg-indigo-50/50 p-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">你的原始回答</span>
            <p className="text-sm italic text-slate-700">“{getOriginalAnswerExample(fullReview) || "我们决定迁移到 React 是因为原来那个老框架太慢了。我负责搭了新代码库，然后团队一页一页重写。"}”</p>
          </div>
          <div className="z-10 -my-2 flex justify-center">
            <div className="rounded-full bg-indigo-600 p-2 text-white"><Sparkles size={16} /></div>
          </div>
          <div className="rounded-2xl bg-indigo-600 p-5 text-white shadow-md">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-indigo-200">AI 重塑建议</span>
            <p className="text-sm font-medium leading-relaxed">
              {getFirstImprovedAnswer(fullReview as FullReviewResult) || evaluation?.rewrittenAnswer || "“当时旧框架造成移动端首屏性能瓶颈，关键页面转化率持续承压。我主导 React 渐进迁移，通过新老页面共存降低上线风险，并把核心组件抽象为团队基础设施。最终 3 个月内将 FCP 提升 40%，同时保障业务零停机迭代。”"}
            </p>
          </div>
        </Card>
      </section>

      <div className="flex flex-col gap-3 md:flex-row md:justify-end">
        <Button variant="outline" className="gap-2">
          <Library size={17} /> 保存到故事库
        </Button>
        <Button size="lg" className="shadow-xl" onClick={onFinish}>
          返回训练大厅
        </Button>
      </div>
    </motion.div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-4">
      <div className="mb-1 flex justify-between text-xs">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function getOriginalAnswerExample(review: FullReviewResult | null) {
  const first = review?.improvedAnswerExamples?.[0];
  const value = first?.originalAnswer;
  return typeof value === "string" && value !== "未体现" ? value : "";
}
