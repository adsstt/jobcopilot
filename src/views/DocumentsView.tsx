import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Card } from "@/components/ui";
import { deleteDocument, renameDocument, requestDocumentDetail, requestDocuments, uploadDocument, type DocumentDetail, type DocumentSummary } from "@/lib/api";
import { Download, ExternalLink, FileText, FileUp, Pencil, Search, Trash2, UploadCloud } from "lucide-react";
import * as motion from "motion/react-client";

const imageOcrMessage = "当前暂不支持图片 OCR，请粘贴文本或上传 PDF/DOCX/TXT";

const typeIcons: Record<string, typeof FileText> = {
  简历: FileText,
  JD: FileText,
  资料: FileText,
};

export function DocumentsView() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentDetail | null>(null);
  const [renameDraft, setRenameDraft] = useState("");
  const [renameTarget, setRenameTarget] = useState<DocumentSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DocumentSummary | null>(null);
  const [query, setQuery] = useState("");
  const [uploadKind, setUploadKind] = useState<"resume" | "jd" | "general">("resume");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [busyDocumentId, setBusyDocumentId] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDocuments = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await requestDocuments();
      setDocuments(data.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "资料加载失败");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return documents;
    return documents.filter((doc) => [doc.title, doc.type, doc.track, doc.fileName || ""].some((value) => value.toLowerCase().includes(keyword)));
  }, [documents, query]);

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    setError("");

    if (file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|bmp|heic)$/i.test(file.name)) {
      setError(imageOcrMessage);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadDocument({ file, kind: uploadKind });
      await loadDocuments();
      setSelectedDocument(result.document);
    } catch (err) {
      setError(err instanceof Error ? err.message : "资料上传失败");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const viewDocument = async (doc: DocumentSummary) => {
    if (!doc.canView || doc.source !== "asset") {
      setError("历史资料暂不支持预览原始解析文本，请从资料中心重新上传文件。");
      return;
    }

    setIsDetailLoading(true);
    setError("");
    try {
      const result = await requestDocumentDetail(doc.id);
      setSelectedDocument(result.document);
    } catch (err) {
      setError(err instanceof Error ? err.message : "资料加载失败");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const downloadDocument = (doc: DocumentSummary) => {
    if (!doc.canDownload || doc.source !== "asset") {
      setError("历史资料没有保存原始文件，无法下载。");
      return;
    }
    window.location.href = `/api/documents/${doc.id}/download`;
  };

  const renameAsset = async (doc: DocumentSummary) => {
    if (doc.source !== "asset") {
      setError("历史资料暂不支持重命名。");
      return;
    }

    setRenameTarget(doc);
    setRenameDraft(doc.title);
  };

  const submitRenameAsset = async () => {
    if (!renameTarget) return;

    const title = renameDraft.trim();
    if (!title) {
      setError("资料名称不能为空");
      return;
    }

    if (title === renameTarget.title) {
      setRenameTarget(null);
      setRenameDraft("");
      return;
    }

    setBusyDocumentId(renameTarget.id);
    setError("");
    try {
      await renameDocument(renameTarget.id, title);
      await loadDocuments();
      setSelectedDocument((current) => (current?.id === renameTarget.id ? { ...current, title } : current));
      setRenameTarget(null);
      setRenameDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "资料重命名失败");
    } finally {
      setBusyDocumentId("");
    }
  };

  const deleteAsset = async (doc: DocumentSummary) => {
    if (doc.source !== "asset") {
      setError("历史资料不能在资料中心删除。");
      return;
    }

    setDeleteTarget(doc);
  };

  const submitDeleteAsset = async () => {
    if (!deleteTarget) return;

    setBusyDocumentId(deleteTarget.id);
    setError("");
    try {
      await deleteDocument(deleteTarget.id);
      setSelectedDocument((current) => (current?.id === deleteTarget.id ? null : current));
      setDeleteTarget(null);
      await loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "资料删除失败");
    } finally {
      setBusyDocumentId("");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">Documents</div>
          <h1 className="font-serif text-4xl font-bold text-slate-900 md:text-5xl">资料中心</h1>
          <p className="mt-2 text-lg text-slate-500">上传简历和 JD，系统会保存原文件与解析文本，后续可直接用于 AI 分析。</p>
        </div>
        <Button className="gap-2 shadow-sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
          <FileUp size={18} /> {isUploading ? "上传中..." : "上传资料"}
        </Button>
      </header>

      <Card className="rounded-[28px] border-dashed p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_1.1fr] md:items-center">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-indigo-50 text-indigo-600">
              <UploadCloud size={26} />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-950">真实文件资产</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">支持 PDF、DOCX、TXT。图片 OCR 暂未开放，截图类 JD 请先粘贴文本。</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <KindOption active={uploadKind === "resume"} title="上传简历" helper="PDF / DOCX / TXT" onClick={() => setUploadKind("resume")} />
            <KindOption active={uploadKind === "jd"} title="上传 JD" helper="职位描述文件" onClick={() => setUploadKind("jd")} />
            <KindOption active={uploadKind === "general"} title="通用资料" helper="备用文本资产" onClick={() => setUploadKind("general")} />
          </div>
          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/png,image/jpeg"
            onChange={(event) => void handleFileUpload(event.target.files?.[0] || null)}
          />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2">
          <Search size={18} className="text-slate-400" />
          <input className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none" placeholder="搜索资料名称、类型或来源" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>

      {error && <Card className="rounded-[24px] border-rose-100 bg-rose-50 p-4 text-sm font-bold text-rose-700">{error}</Card>}

      <div className="grid gap-4 md:grid-cols-2">
        {isLoading && <Card className="rounded-[28px] p-5 text-sm font-semibold text-slate-500">正在加载真实资料...</Card>}
        {!isLoading && !filteredDocuments.length && (
          <Card className="rounded-[28px] p-5 text-sm font-semibold text-slate-500">暂无资料。上传一份 PDF、DOCX 或 TXT 后，这里会展示真实文件资产。</Card>
        )}
        {!isLoading &&
          filteredDocuments.map((doc) => {
            const Icon = typeIcons[doc.type] ?? FileText;
            return (
              <Card key={`${doc.source}-${doc.id}`} className="rounded-[28px] p-5 transition-all hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs font-bold text-indigo-700">{doc.type}</span>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{doc.track}</span>
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">{doc.status}</span>
                      </div>
                      <h3 className="mt-3 truncate text-lg font-bold text-slate-950">{doc.title}</h3>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {formatDate(doc.updated)} 更新 · {doc.size}
                        {doc.textSize ? ` · 文本 ${doc.textSize}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                      onClick={() => void renameAsset(doc)}
                      disabled={doc.source !== "asset" || busyDocumentId === doc.id}
                      title="重命名"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                      onClick={() => void deleteAsset(doc)}
                      disabled={doc.source !== "asset" || busyDocumentId === doc.id}
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1 text-slate-600" onClick={() => downloadDocument(doc)} disabled={!doc.canDownload}>
                    <Download size={14} /> 下载
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1 gap-1" onClick={() => void viewDocument(doc)} disabled={!doc.canView || isDetailLoading}>
                    <ExternalLink size={14} /> 查看
                  </Button>
                </div>
              </Card>
            );
          })}
      </div>

      {renameTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="rename-document-title">
          <Card className="w-full max-w-xl rounded-[28px] p-6 shadow-2xl">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Rename</div>
            <h2 id="rename-document-title" className="mt-2 text-2xl font-bold text-slate-950">
              编辑资料名称
            </h2>
            <p className="mt-2 text-sm text-slate-500">修改后会同步更新资料卡片和详情标题。</p>
            <form
              className="mt-5"
              onSubmit={(event) => {
                event.preventDefault();
                void submitRenameAsset();
              }}
            >
              <label className="block text-sm font-semibold text-slate-700" htmlFor="document-rename-input">
                资料名称
              </label>
              <input
                id="document-rename-input"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                value={renameDraft}
                onChange={(event) => setRenameDraft(event.target.value)}
                maxLength={120}
                autoFocus
              />
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setRenameTarget(null);
                    setRenameDraft("");
                  }}
                  disabled={busyDocumentId === renameTarget.id}
                >
                  取消
                </Button>
                <Button type="submit" disabled={busyDocumentId === renameTarget.id}>
                  {busyDocumentId === renameTarget.id ? "保存中..." : "确定"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delete-document-title">
          <Card className="w-full max-w-lg rounded-[28px] p-6 shadow-2xl">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600">Delete</div>
            <h2 id="delete-document-title" className="mt-2 text-2xl font-bold text-slate-950">
              删除资料
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              确认删除「
              {deleteTarget.title}
              」吗？原文件和解析文本都会一起移除，这个操作无法撤销。
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)} disabled={busyDocumentId === deleteTarget.id}>
                取消
              </Button>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center rounded-full bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => void submitDeleteAsset()}
                disabled={busyDocumentId === deleteTarget.id}
              >
                {busyDocumentId === deleteTarget.id ? "删除中..." : "确认删除"}
              </button>
            </div>
          </Card>
        </div>
      )}

      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <Card className="flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px]">
            <div className="border-b border-slate-100 p-5">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">{selectedDocument.kind === "resume" ? "Resume" : selectedDocument.kind === "jd" ? "Job Description" : "Document"}</div>
              <h2 className="mt-2 text-2xl font-bold text-slate-950">{selectedDocument.title}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">{selectedDocument.fileName}</p>
            </div>
            <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap bg-slate-50 p-5 text-sm leading-relaxed text-slate-700">{selectedDocument.parsedText}</pre>
            <div className="flex justify-end gap-3 border-t border-slate-100 p-4">
              <Button variant="outline" onClick={() => setSelectedDocument(null)}>关闭</Button>
              <Button onClick={() => { window.location.href = `/api/documents/${selectedDocument.id}/download`; }}>下载原文件</Button>
            </div>
          </Card>
        </div>
      )}
    </motion.div>
  );
}

function KindOption({ active, title, helper, onClick }: { active: boolean; title: string; helper: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-28 flex-col items-center justify-center rounded-3xl border-2 border-dashed p-4 text-center transition-all ${
        active ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-slate-50 text-slate-500 hover:border-indigo-300 hover:bg-indigo-50"
      }`}
    >
      <UploadCloud size={24} />
      <span className="mt-2 text-sm font-bold text-slate-800">{title}</span>
      <span className="mt-1 text-xs font-medium">{helper}</span>
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
