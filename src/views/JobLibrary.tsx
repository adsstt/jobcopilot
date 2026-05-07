import React from 'react';
import { Card, Button } from '@/components/ui';
import { Plus, Building2, MoreVertical, Search, Filter } from 'lucide-react';
import * as motion from "motion/react-client";

export function JobLibrary() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">职位库</h1>
          <p className="text-slate-500 text-lg">管理你的目标职位和面试进度，集中存放 JD 和面试记录。</p>
        </div>
        <Button className="hidden md:flex gap-2 shadow-sm"><Plus size={18}/> 新增职位</Button>
      </header>

      {/* 移动端新建按钮 */}
      <Button className="md:hidden justify-center gap-2 w-full"><Plus size={18}/> 新增职位</Button>
      
      {/* 筛选与搜索 */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
         <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 min-w-[200px] flex-1 md:flex-none">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="搜索公司或职位" className="bg-transparent outline-none flex-1 text-sm font-medium" />
         </div>
         <Button variant="outline" className="shrink-0 gap-2 font-semibold rounded-full border-slate-200">
            <Filter size={16} /> 筛选状态
         </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* Job Card 1 */}
        <Card className="p-6 transition-all hover:shadow-md flex flex-col gap-4 border-2 border-l-4 border-slate-100 border-l-indigo-600">
           <div className="flex justify-between items-start">
             <div className="flex flex-col gap-1.5">
               <h3 className="font-bold text-lg text-slate-900">高级交互设计师</h3>
               <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                 <Building2 size={14}/> 腾讯云 (Tencent Cloud)
               </div>
             </div>
             <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16}/></button>
           </div>
           
           <div className="flex flex-wrap gap-2">
             <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1.5 rounded-md font-bold">一面准备中</span>
             <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-md font-medium">85% 匹配度</span>
           </div>

           <div className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl line-clamp-2 leading-relaxed">
             负责腾讯云控制台核心业务的体验设计，主导制定设计规范体系，需要有良好的全局观和复杂链路梳理能力...
           </div>

           <div className="flex gap-2 mt-auto pt-2">
             <Button variant="outline" size="sm" className="flex-1 text-slate-600 font-semibold border-slate-200">查看 JD</Button>
             <Button variant="primary" size="sm" className="flex-1 font-semibold">发起模拟面试</Button>
           </div>
        </Card>

        {/* Job Card 2 */}
        <Card className="p-6 transition-all hover:shadow-md flex flex-col gap-4 border-2 border-l-4 border-slate-100 border-l-emerald-500 bg-emerald-50/20">
           <div className="flex justify-between items-start">
             <div className="flex flex-col gap-1.5">
               <h3 className="font-bold text-lg text-slate-900">产品体验设计师 (UX)</h3>
               <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                 <Building2 size={14}/> 字节跳动 (ByteDance)
               </div>
             </div>
             <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16}/></button>
           </div>
           
           <div className="flex flex-wrap gap-2">
             <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1.5 rounded-md font-bold">已录用 (Offer)</span>
             <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-md font-medium">海外电商业务</span>
           </div>

           <div className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl line-clamp-2 leading-relaxed">
             深入理解电商用户行为，推动海外市场的购物体验本地化，与跨国团队协同工作...
           </div>

           <div className="flex gap-2 mt-auto pt-2">
             <Button variant="outline" size="sm" className="w-full text-slate-600 font-semibold border-slate-200">查看复盘报告</Button>
           </div>
        </Card>

        {/* Job Card 3 */}
        <Card className="p-6 transition-all hover:shadow-md flex flex-col gap-4 border-2 border-l-4 border-slate-100 border-l-slate-400">
           <div className="flex justify-between items-start">
             <div className="flex flex-col gap-1.5">
               <h3 className="font-bold text-lg text-slate-900">UI/UX 设计专家</h3>
               <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                 <Building2 size={14}/> 某 AI 独角兽企业
               </div>
             </div>
             <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16}/></button>
           </div>
           
           <div className="flex flex-wrap gap-2">
             <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1.5 rounded-md font-bold">已投递</span>
           </div>

           <div className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl line-clamp-2 leading-relaxed">
             负责 AI 助手类产品的全栈体验设计，要求熟悉 AI 产品的交互范式，注重动效细节...
           </div>

           <div className="flex gap-2 mt-auto pt-2">
             <Button variant="outline" size="sm" className="flex-1 text-slate-600 font-semibold border-slate-200">查看 JD</Button>
             <Button variant="secondary" size="sm" className="flex-1 font-semibold">生成匹配分析</Button>
           </div>
        </Card>
      </div>
    </motion.div>
  )
}
