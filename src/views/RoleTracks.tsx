import React from "react";
import { Button, Card } from "@/components/ui";
import { roleTracks, toneClasses } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CheckCircle2, Plus, Sparkles, Target } from "lucide-react";
import * as motion from "motion/react-client";

interface RoleTracksProps {
  onStartInterview: () => void;
}

export function RoleTracks({ onStartInterview }: RoleTracksProps) {
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
        <Button className="gap-2 shadow-sm">
          <Plus size={18} /> 新建方向
        </Button>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {roleTracks.map((track, index) => {
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
                  <Button variant="outline" className="flex-1 gap-2">
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
          <Button className="bg-white text-slate-900 hover:bg-slate-100">整理故事映射</Button>
        </div>
      </Card>
    </motion.div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <div className="text-xs font-semibold text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-bold text-slate-950">{value}</div>
    </div>
  );
}
