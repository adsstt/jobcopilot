import {
  BarChart3,
  BriefcaseBusiness,
  Code2,
  Megaphone,
  PenTool,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type TrackTone = "indigo" | "emerald" | "blue" | "amber" | "rose" | "slate";

export interface RoleTrack {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  tone: TrackTone;
  match: number;
  sessions: number;
  avgScore: number;
  nextFocus: string;
  abilities: Array<{ label: string; score: number }>;
  questions: string[];
}

export const toneClasses: Record<TrackTone, { bg: string; text: string; border: string; soft: string }> = {
  indigo: { bg: "bg-indigo-600", text: "text-indigo-600", border: "border-indigo-200", soft: "bg-indigo-50" },
  emerald: { bg: "bg-emerald-600", text: "text-emerald-600", border: "border-emerald-200", soft: "bg-emerald-50" },
  blue: { bg: "bg-blue-600", text: "text-blue-600", border: "border-blue-200", soft: "bg-blue-50" },
  amber: { bg: "bg-amber-500", text: "text-amber-600", border: "border-amber-200", soft: "bg-amber-50" },
  rose: { bg: "bg-rose-600", text: "text-rose-600", border: "border-rose-200", soft: "bg-rose-50" },
  slate: { bg: "bg-slate-900", text: "text-slate-700", border: "border-slate-200", soft: "bg-slate-100" },
};

export const roleTracks: RoleTrack[] = [
  {
    id: "frontend",
    title: "技术岗",
    subtitle: "前端 / 后端 / 架构",
    description: "围绕项目深度、系统设计、工程协作和技术决策展开高压追问。",
    icon: Code2,
    tone: "emerald",
    match: 88,
    sessions: 12,
    avgScore: 86,
    nextFocus: "补强系统设计中的指标表达",
    abilities: [
      { label: "项目深度", score: 92 },
      { label: "系统设计", score: 84 },
      { label: "工程协作", score: 88 },
      { label: "业务影响", score: 74 },
    ],
    questions: ["讲一个你解决复杂性能问题的案例", "如果技术方案被业务挑战，你会如何推进？", "你如何衡量一次架构迁移成功？"],
  },
  {
    id: "product",
    title: "产品岗",
    subtitle: "B 端 / C 端 / AI 产品",
    description: "训练用户洞察、需求判断、优先级取舍和跨团队推动能力。",
    icon: PenTool,
    tone: "indigo",
    match: 84,
    sessions: 8,
    avgScore: 82,
    nextFocus: "把用户问题和商业结果连接得更紧",
    abilities: [
      { label: "需求判断", score: 88 },
      { label: "数据意识", score: 76 },
      { label: "方案表达", score: 86 },
      { label: "推动落地", score: 81 },
    ],
    questions: ["你如何判断一个需求是否值得做？", "讲一个你砍掉需求的案例", "AI 产品里你如何设计信任感？"],
  },
  {
    id: "ops",
    title: "运营岗",
    subtitle: "增长 / 活动 / 用户运营",
    description: "强调目标拆解、资源协调、活动复盘和数据驱动表达。",
    icon: Megaphone,
    tone: "amber",
    match: 79,
    sessions: 5,
    avgScore: 78,
    nextFocus: "补充活动前后的数据归因",
    abilities: [
      { label: "目标拆解", score: 82 },
      { label: "数据复盘", score: 72 },
      { label: "资源协调", score: 84 },
      { label: "用户理解", score: 77 },
    ],
    questions: ["一次活动没有达标，你怎么复盘？", "你如何拆解一个增长目标？", "资源不足时你如何取舍？"],
  },
  {
    id: "management",
    title: "管理岗",
    subtitle: "晋升 / 团队负责人",
    description: "聚焦组织判断、冲突处理、目标管理和人才培养。",
    icon: UsersRound,
    tone: "blue",
    match: 81,
    sessions: 6,
    avgScore: 80,
    nextFocus: "把管理动作讲成可复制机制",
    abilities: [
      { label: "目标管理", score: 84 },
      { label: "冲突处理", score: 76 },
      { label: "人才培养", score: 79 },
      { label: "业务判断", score: 82 },
    ],
    questions: ["你如何处理团队里的低绩效成员？", "讲一次你和业务方产生冲突的经历", "你如何培养一个新人独立负责模块？"],
  },
];

export const quickQuestions = [
  { category: "行为面", track: "技术岗", difficulty: "中等", title: "讲一个你在项目中主动承担责任的案例", mastered: 72 },
  { category: "专业面", track: "产品岗", difficulty: "困难", title: "如果核心指标下滑 20%，你会如何定位问题？", mastered: 58 },
  { category: "压力面", track: "运营岗", difficulty: "困难", title: "你这个方案听起来很普通，为什么不是别人也能做？", mastered: 41 },
  { category: "HR 面", track: "管理岗", difficulty: "基础", title: "你为什么考虑现在这个阶段换机会？", mastered: 86 },
  { category: "英文面", track: "技术岗", difficulty: "中等", title: "Tell me about a technical decision you reversed.", mastered: 64 },
];

export const reviewReports = [
  {
    title: "技术岗完整模拟",
    date: "今天 20:40",
    score: 88,
    rating: "A-",
    focus: "系统设计表达明显提升，但业务指标仍偏少。",
    tags: ["技术深挖", "严格模式", "已收藏 2 条回答"],
  },
  {
    title: "产品岗 5 分钟快练",
    date: "昨天 09:18",
    score: 82,
    rating: "B+",
    focus: "需求判断有框架，案例里的取舍依据还可以更锐利。",
    tags: ["需求判断", "追问训练"],
  },
  {
    title: "运营岗压力追问",
    date: "4 月 29 日",
    score: 76,
    rating: "B",
    focus: "抗压节奏稳定，数据归因和复盘结论需要补强。",
    tags: ["压力面", "数据复盘"],
  },
];

export const documents = [
  { type: "简历", title: "技术岗_资深前端_2026.pdf", track: "技术岗", status: "默认", updated: "2026-05-01", size: "2.4 MB" },
  { type: "JD", title: "AI 产品经理 JD - B 端平台", track: "产品岗", status: "已分析", updated: "2026-04-30", size: "纯文本" },
  { type: "作品集", title: "portfolio.george.design", track: "产品岗", status: "外链", updated: "2026-04-22", size: "URL" },
  { type: "JD", title: "增长运营专家岗位截图", track: "运营岗", status: "待分析", updated: "2026-04-18", size: "PNG" },
];

export const dashboardStats = [
  { label: "已完成训练", value: "31", helper: "本周 +5", icon: BarChart3 },
  { label: "平均表现", value: "84", helper: "较上周 +6", icon: BriefcaseBusiness },
  { label: "沉淀故事", value: "18", helper: "可用于 5 个方向", icon: PenTool },
];
