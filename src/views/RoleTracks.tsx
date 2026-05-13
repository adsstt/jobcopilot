import React, { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import { roleTracks, toneClasses, type RoleTrack } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Plus, Sparkles, Target, X } from "lucide-react";
import * as motion from "motion/react-client";

interface RoleTracksProps {
  onStartInterview: () => void;
  onOpenQuestions: () => void;
  onOpenStories: () => void;
}

interface TrackDraft {
  title: string;
  subtitle: string;
  description: string;
  nextFocus: string;
  abilities: string;
}

const CUSTOM_TRACKS_KEY = "jobcopilot.customRoleTracks";

const emptyTrackDraft: TrackDraft = {
  title: "",
  subtitle: "",
  description: "",
  nextFocus: "",
  abilities: "岗位理解、表达结构、案例匹配、结果量化",
};

export function RoleTracks({ onStartInterview, onOpenQuestions, onOpenStories }: RoleTracksProps) {
  const [customTracks, setCustomTracks] = useState<RoleTrack[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draft, setDraft] = useState<TrackDraft>(emptyTrackDraft);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setCustomTracks(loadCustomTracks());
  }, []);

  const openCreateDialog = () => {
    setDraft(emptyTrackDraft);
    setFormError("");
    setIsCreateOpen(true);
  };

  const closeCreateDialog = () => {
    setIsCreateOpen(false);
    setFormError("");
  };

  const createTrack = () => {
    const title = draft.title.trim();
    if (!title) {
      setFormError("请填写方向名称。");
      return;
    }

    const subtitle = draft.subtitle.trim() || "自定义方向";
    const description = draft.description.trim() || "围绕该岗位方向沉淀能力、题库和高分故事，形成可持续训练路径。";
    const abilityLabels = splitAbilityLabels(draft.abilities);

    const next: RoleTrack = {
      id: `custom-${Date.now()}`,
      title: title.slice(0, 24),
      subtitle: subtitle.slice(0, 40),
      description: description.slice(0, 140),
      icon: BriefcaseBusiness,
      tone: "slate",
      match: 70,
      sessions: 0,
      avgScore: 0,
      nextFocus: (draft.nextFocus.trim() || "先完成一次模拟面试，系统会沉淀真实训练建议。").slice(0, 90),
      abilities: abilityLabels.map((label, index) => ({ label, score: Math.max(58, 72 - index * 4) })),
      questions: [],
    };

    const updated = [next, ...customTracks];
    setCustomTracks(updated);
    saveCustomTracks(updated);
    closeCreateDialog();
  };

  const tracks = [...customTracks, ...roleTracks];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Role Tracks</div>
          <h1 className="font-serif text-4xl font-bold text-slate-900 md:text-5xl">岗位方向训练</h1>
          <p className="mt-2 max-w-2xl text-lg leading-relaxed text-slate-500">
            不按公司建档，而是围绕技术、产品、运营、管理等方向长期沉淀能力、题库和高分故事。
          </p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={openCreateDialog}>
          <Plus size={18} /> 新建方向
        </Button>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {tracks.map((track, index) => {
          const tone = toneClasses[track.tone];
          return (
            <motion.div key={track.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <Card className={cn("overflow-hidden border-2 p-6 transition-all hover:-translate-y-1 hover:shadow-md", tone.border)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-[22px]", tone.soft, tone.text)}>
                      <track.icon size={26} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-950">{track.title}</h2>
                      <p className="text-sm font-semibold text-slate-500">{track.subtitle}</p>
                    </div>
                  </div>
                  <div className="rounded-full bg-slate-50 px-3 py-1 text-sm font-bold text-slate-700">{track.avgScore} 分</div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-slate-600">{track.description}</p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <Metric label="匹配度" value={`${track.match}%`} />
                  <Metric label="训练" value={`${track.sessions} 次`} />
                  <Metric label="待补强" value="1 项" />
                </div>

                <div className="mt-6 space-y-3">
                  {track.abilities.map((ability) => (
                    <div key={ability.label}>
                      <div className="mb-1 flex justify-between text-xs font-bold text-slate-500">
                        <span>{ability.label}</span>
                        <span>{ability.score}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className={cn("h-full rounded-full", tone.bg)} style={{ width: `${ability.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Target size={16} /> 下一次建议
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{track.nextFocus}</p>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button onClick={onStartInterview} className="flex-1 gap-2">
                    <Sparkles size={17} /> 开始模拟
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2" onClick={onOpenQuestions}>
                    查看题库 <ArrowUpRight size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="rounded-[28px] bg-slate-900 p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-200">
              <CheckCircle2 size={18} /> 方向制训练策略
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
              同一段经历可以在技术岗讲方案深度，在产品岗讲用户价值，在管理岗讲协作推动。系统会把故事映射到不同方向。
            </p>
          </div>
          <Button className="bg-white text-slate-900 hover:bg-slate-100" onClick={onOpenStories}>整理故事映射</Button>
        </div>
      </Card>

      {isCreateOpen && (
        <CreateTrackDialog
          draft={draft}
          error={formError}
          onChange={setDraft}
          onClose={closeCreateDialog}
          onSubmit={createTrack}
        />
      )}
    </motion.div>
  );
}

function CreateTrackDialog({
  draft,
  error,
  onChange,
  onClose,
  onSubmit,
}: {
  draft: TrackDraft;
  error: string;
  onChange: (draft: TrackDraft) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const update = (field: keyof TrackDraft, value: string) => onChange({ ...draft, [field]: value });

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl md:p-8"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">New Track</div>
            <h2 className="font-serif text-3xl font-bold text-slate-950">新建岗位方向</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">为长期训练创建一个方向，后续可从这里进入模拟面试、题库和故事映射。</p>
          </div>
          <button onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <TrackField label="方向名称" helper="例如：数据分析岗、销售岗、客户成功岗">
              <input
                value={draft.title}
                onChange={(event) => update("title", event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="数据分析岗"
                autoFocus
              />
            </TrackField>
            <TrackField label="领域说明" helper="用于显示在卡片标题下方">
              <input
                value={draft.subtitle}
                onChange={(event) => update("subtitle", event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="增长 / 数据 / 商业分析"
              />
            </TrackField>
          </div>

          <TrackField label="训练描述" helper="说明这个方向主要训练什么能力">
            <textarea
              value={draft.description}
              onChange={(event) => update("description", event.target.value)}
              className="min-h-24 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-relaxed text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="围绕数据洞察、业务归因、指标拆解和跨团队推动展开训练。"
            />
          </TrackField>

          <TrackField label="下一次训练建议" helper="显示在方向卡片的建议区">
            <input
              value={draft.nextFocus}
              onChange={(event) => update("nextFocus", event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="补强业务指标拆解和结论表达"
            />
          </TrackField>

          <TrackField label="能力标签" helper="用顿号或逗号分隔，最多 4 个">
            <input
              value={draft.abilities}
              onChange={(event) => update("abilities", event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="岗位理解、表达结构、案例匹配、结果量化"
            />
          </TrackField>

          {error && <div className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-600">{error}</div>}
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onClose}>取消</Button>
          <Button className="gap-2 px-7 shadow-lg" onClick={onSubmit}>
            <Plus size={17} /> 创建方向
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function TrackField({ label, helper, children }: { label: string; helper: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-slate-900">{label}</span>
      {children}
      <span className="text-xs font-medium text-slate-500">{helper}</span>
    </label>
  );
}

function loadCustomTracks(): RoleTrack[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_TRACKS_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.map((track) => ({
      ...track,
      icon: BriefcaseBusiness,
      tone: "slate",
      abilities: Array.isArray(track.abilities) ? track.abilities : [],
      questions: Array.isArray(track.questions) ? track.questions : [],
    }));
  } catch {
    return [];
  }
}

function saveCustomTracks(tracks: RoleTrack[]) {
  localStorage.setItem(
    CUSTOM_TRACKS_KEY,
    JSON.stringify(
      tracks.map(({ icon: _icon, ...track }) => track)
    )
  );
}

function splitAbilityLabels(value: string) {
  const labels = value
    .split(/[、,，/]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  return labels.length ? labels : ["岗位理解", "表达结构", "案例匹配", "结果量化"];
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-bold text-slate-950">{value}</div>
    </div>
  );
}
