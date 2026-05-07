import React, { useEffect, useState } from "react";
import { Card, Button } from "@/components/ui";
import { generateStories, requestStories, saveStory, type StoryCard } from "@/lib/api";
import { Plus, Tag, RefreshCw, Star, Save, Pencil } from "lucide-react";
import * as motion from "motion/react-client";

const emptyStory: StoryCard = {
  id: "",
  title: "新的项目故事",
  background: "",
  task: "",
  action: "",
  result: "",
  relatedSkill: "项目表达",
  relatedJDKeywords: [],
  confidenceScore: 60,
  isHighFrequency: false,
  source: "manual",
  updatedAt: new Date().toISOString(),
};

export function StoryLibrary() {
  const [stories, setStories] = useState<StoryCard[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<StoryCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = () => {
    setIsLoading(true);
    setError("");
    requestStories()
      .then((data) => setStories(data.stories))
      .catch((err) => setError(err instanceof Error ? err.message : "故事库加载失败"))
      .finally(() => setIsLoading(false));
  };

  const startEdit = (story: StoryCard) => {
    setEditingId(story.id || "new");
    setDraft({ ...story });
  };

  const addManualStory = () => {
    startEdit({ ...emptyStory, updatedAt: new Date().toISOString() });
  };

  const saveDraft = async () => {
    if (!draft) return;
    const payload = {
      ...draft,
      relatedJDKeywords: normalizeKeywords(draft.relatedJDKeywords),
    };
    const saved = await saveStory(payload);
    setStories((current) => {
      const exists = current.some((story) => story.id === saved.story.id);
      return exists ? current.map((story) => (story.id === saved.story.id ? saved.story : story)) : [saved.story, ...current];
    });
    setEditingId(null);
    setDraft(null);
  };

  const runGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const data = await generateStories();
      setStories((current) => mergeStories(current, data.stories));
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI 生成故事失败");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex min-w-0 flex-col gap-8">
      <header className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="mb-2 font-serif text-4xl font-bold text-slate-900">个人故事库</h1>
          <p className="text-lg text-slate-500">沉淀你的项目经历、复盘优化回答和高频面试素材，整理成可复用的 STAR 故事。</p>
        </div>
        <div className="hidden gap-3 md:flex">
          <Button variant="outline" className="gap-2 shadow-sm" onClick={runGenerate} disabled={isGenerating}>
            <RefreshCw size={18} /> {isGenerating ? "生成中..." : "AI 自动生成"}
          </Button>
          <Button className="gap-2 shadow-sm" onClick={addManualStory}>
            <Plus size={18} /> 新增经历
          </Button>
        </div>
      </header>

      <div className="grid gap-3 md:hidden">
        <Button variant="outline" className="justify-center gap-2" onClick={runGenerate} disabled={isGenerating}>
          <RefreshCw size={18} /> {isGenerating ? "生成中..." : "AI 自动生成"}
        </Button>
        <Button className="justify-center gap-2" onClick={addManualStory}>
          <Plus size={18} /> 新增经历
        </Button>
      </div>

      {error && <Card className="p-5 text-sm font-semibold text-rose-600">{error}</Card>}
      {isLoading && <Card className="p-5 text-sm font-semibold text-slate-500">正在读取真实故事库...</Card>}
      {!isLoading && !stories.length && !draft && (
        <Card className="p-6 text-sm font-semibold text-slate-500">
          暂无故事素材。系统会优先从简历、面试消息和复盘优化回答中提取；你也可以手动新增第一条。
        </Card>
      )}

      <div className="grid min-w-0 gap-6">
        {draft && editingId === "new" && <StoryEditor story={draft} onChange={setDraft} onSave={saveDraft} onCancel={() => setDraft(null)} />}
        {stories.map((story) =>
          editingId === story.id && draft ? (
            <StoryEditor key={story.id} story={draft} onChange={setDraft} onSave={saveDraft} onCancel={() => setEditingId(null)} />
          ) : (
            <StoryCardView key={story.id} story={story} onEdit={() => startEdit(story)} />
          )
        )}
      </div>
    </motion.div>
  );
}

function StoryCardView({ story, onEdit }: { story: StoryCard; onEdit: () => void }) {
  return (
    <Card className="min-w-0 p-5 transition-all hover:shadow-md sm:p-6">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h3 className="break-words text-xl font-bold">{story.title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            最近修改 {formatDate(story.updatedAt)} · 来源 {sourceLabel(story.source)} · 可信度 {story.confidenceScore}%
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {story.isHighFrequency && (
            <span className="flex items-center gap-1 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
              <Star size={12} /> 高频面试素材
            </span>
          )}
          <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
            <Pencil size={15} /> 编辑
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
          <Tag size={12} /> {story.relatedSkill}
        </span>
        {story.relatedJDKeywords.map((keyword) => (
          <span key={keyword} className="flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">
            <Tag size={12} /> {keyword}
          </span>
        ))}
      </div>

      <div className="relative min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
        <div className="mb-4 flex max-w-full gap-2 overflow-x-auto border-b border-slate-200 pb-2">
          <button className="shrink-0 whitespace-nowrap border-b-2 border-indigo-600 pb-1 font-bold text-indigo-600">STAR 结构版</button>
          <button className="shrink-0 whitespace-nowrap px-3 pb-1 font-medium text-slate-500">业务结果版</button>
          <button className="shrink-0 whitespace-nowrap px-3 pb-1 font-medium text-slate-500">技术深挖版</button>
          <button className="shrink-0 whitespace-nowrap px-3 pb-1 font-medium text-slate-500">协作复盘版</button>
        </div>
        <div className="min-w-0 space-y-4 break-words">
          <StorySection label="Situation (背景)" value={story.background} />
          <StorySection label="Task (任务)" value={story.task} />
          <StorySection label="Action (行动)" value={story.action} />
          <StorySection label="Result (结果)" value={story.result} />
        </div>
      </div>
    </Card>
  );
}

function StoryEditor({
  story,
  onChange,
  onSave,
  onCancel,
}: {
  story: StoryCard;
  onChange: (story: StoryCard) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const update = (field: keyof StoryCard, value: unknown) => onChange({ ...story, [field]: value });

  return (
    <Card className="min-w-0 p-5 sm:p-6">
      <div className="grid gap-4">
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-bold outline-none focus:ring-2 focus:ring-indigo-500"
          value={story.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="故事标题"
        />
        <div className="grid gap-3 md:grid-cols-3">
          <input
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={story.relatedSkill}
            onChange={(event) => update("relatedSkill", event.target.value)}
            placeholder="关联能力"
          />
          <input
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-2"
            value={story.relatedJDKeywords.join("，")}
            onChange={(event) => update("relatedJDKeywords", splitKeywords(event.target.value))}
            placeholder="JD 关键词，用逗号分隔"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <TextArea label="Situation 背景" value={story.background} onChange={(value) => update("background", value)} />
          <TextArea label="Task 任务" value={story.task} onChange={(value) => update("task", value)} />
          <TextArea label="Action 行动" value={story.action} onChange={(value) => update("action", value)} />
          <TextArea label="Result 结果" value={story.result} onChange={(value) => update("result", value)} />
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={story.isHighFrequency} onChange={(event) => update("isHighFrequency", event.target.checked)} />
            标记为高频面试素材
          </label>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button className="gap-2" onClick={onSave}>
              <Save size={16} /> 保存
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <textarea
        className="min-h-32 resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-indigo-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function StorySection({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <strong className="mb-1 block text-slate-900">{label}</strong>
      {value || "未体现，建议补充。"}
    </div>
  );
}

function mergeStories(current: StoryCard[], generated: StoryCard[]) {
  const existingIds = new Set(current.map((story) => story.id));
  return [...generated.filter((story) => !existingIds.has(story.id)), ...current];
}

function splitKeywords(value: string) {
  return value
    .split(/[,，、]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeKeywords(value: string[]) {
  return value.map((item) => item.trim()).filter(Boolean);
}

function sourceLabel(source: string) {
  if (source === "review") return "复盘";
  if (source === "interview") return "面试";
  if (source === "resume") return "简历";
  if (source === "mixed") return "综合提取";
  return "手动";
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
