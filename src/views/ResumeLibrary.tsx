import React from 'react';
import { Card, Button } from '@/components/ui';
import { Plus, FileText, Download, MoreVertical, Calendar, UploadCloud } from 'lucide-react';
import * as motion from "motion/react-client";

export function ResumeLibrary() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">简历库</h1>
          <p className="text-slate-500 text-lg">统一管理你的多版本简历，针对不同岗位方向量身定制。</p>
        </div>
        <Button className="hidden md:flex gap-2 shadow-sm"><Plus size={18}/> 上传新简历</Button>
      </header>

      {/* 移动端新建按钮 */}
      <Button className="md:hidden justify-center gap-2 w-full"><Plus size={18}/> 上传新简历</Button>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
         <button className="flex h-48 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:border-indigo-300 hover:text-indigo-600 transition-all group w-full">
           <UploadCloud size={32} className="group-hover:scale-110 transition-transform" />
           <span className="font-semibold text-slate-700">点击上传新版本简历</span>
         </button>

         {/* Resume Card 1 */}
         <Card className="p-6 transition-all hover:shadow-md flex flex-col gap-4 border-2 border-slate-100">
            <div className="flex justify-between items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FileText size={24} />
              </div>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16}/></button>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">资深交互设计师_2026.pdf</h3>
              <div className="flex gap-4 mt-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={13}/> 2026-04-15更新</span>
                <span>2.4 MB</span>
              </div>
            </div>

            <div className="flex gap-2">
               <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold">默认设置</span>
               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">平台体验方向</span>
            </div>

            <div className="flex gap-2 mt-auto pt-2">
              <Button variant="outline" size="sm" className="flex-1 text-slate-600 font-semibold"><Download size={14} className="mr-1"/> 下载</Button>
              <Button variant="secondary" size="sm" className="flex-1">预览</Button>
            </div>
         </Card>

         {/* Resume Card 2 */}
         <Card className="p-6 transition-all hover:shadow-md flex flex-col gap-4 border-2 border-slate-100">
            <div className="flex justify-between items-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <FileText size={24} />
              </div>
              <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16}/></button>
            </div>
            
            <div>
              <h3 className="font-bold text-lg text-slate-900 leading-tight">产品经理_B端系统_纯文本导入版</h3>
              <div className="flex gap-4 mt-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1"><Calendar size={13}/> 2026-02-10更新</span>
                <span>纯文本</span>
              </div>
            </div>

            <div className="flex gap-2">
               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">B端方向</span>
            </div>

            <div className="flex gap-2 mt-auto pt-2">
              <Button variant="outline" size="sm" className="w-full text-slate-600 font-semibold">编辑内容</Button>
            </div>
         </Card>
      </div>
    </motion.div>
  )
}
