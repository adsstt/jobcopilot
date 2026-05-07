import React, { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import { requestDocuments, type DocumentSummary } from "@/lib/api";
import { Download, ExternalLink, FileText, Image, Link, MoreVertical, Plus, Search, UploadCloud } from "lucide-react";
import * as motion from "motion/react-client";

const typeIcons: Record<string, typeof FileText> = {
  简历: FileText,
  JD: Image,
  作品集: Link,
};

export function DocumentsView() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    requestDocuments()
      .then((data) => {
        if (active) setDocuments(data.documents);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "资料加载失败");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Documents</div>
          <h1 className="font-serif text-4xl font-bold text-slate-900 md:text-5xl">资料中心</h1>
          <p className="mt-2 text-lg text-slate-500">管理简历、JD、作品集，并把它们关联到岗位方向。</p>
        </div>
        <Button className="gap-2 shadow-sm">
          <Plus size={18} /> 新增资料
        </Button>
      </header>

      <Card className="rounded-[28px] border-dashed p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-indigo-50 text-indigo-600">
              <UploadCloud size={26} />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-950">手机和电脑都可以上传</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">完成简历/JD 分析后，系统会自动把用过的简历和岗位资料沉淀在这里，方便后续复盘和再次练习。</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <UploadOption title="上传简历" helper="PDF / Word / 图片" />
            <UploadOption title="粘贴 JD" helper="文本或截图" />
            <UploadOption title="添加作品集" helper="URL 外链" />
          </div>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
          <Search size={18} className="text-slate-400" />
          <input className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none" placeholder="搜索资料名称或岗位方向" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading && <Card className="rounded-[28px] p-5 text-sm font-semibold text-slate-500">正在加载真实资料...</Card>}
        {!isLoading && error && <Card className="rounded-[28px] p-5 text-sm font-semibold text-rose-600">{error}</Card>}
        {!isLoading && !error && !documents.length && (
          <Card className="rounded-[28px] p-5 text-sm font-semibold text-slate-500">暂无资料。完成一次简历/JD 分析后，这里会展示真实数据库记录。</Card>
        )}
        {!isLoading &&
          !error &&
          documents.map((doc) => {
            const Icon = typeIcons[doc.type] ?? FileText;
            return (
              <Card key={`${doc.type}-${doc.id}`} className="rounded-[28px] p-5 transition-all hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">{doc.type}</span>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{doc.track}</span>
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{doc.status}</span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-slate-950">{doc.title}</h3>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {formatDate(doc.updated)} 更新 · {doc.size}
                      </p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <div className="mt-5 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1 text-slate-600">
                    <Download size={14} /> 下载
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1 gap-1">
                    <ExternalLink size={14} /> 查看
                  </Button>
                </div>
              </Card>
            );
          })}
      </div>
    </motion.div>
  );
}

function UploadOption({ title, helper }: { title: string; helper: string }) {
  return (
    <button className="flex min-h-28 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center transition-all hover:border-indigo-300 hover:bg-indigo-50">
      <UploadCloud className="text-slate-400" size={24} />
      <span className="mt-2 text-sm font-bold text-slate-800">{title}</span>
      <span className="mt-1 text-xs font-medium text-slate-500">{helper}</span>
    </button>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
