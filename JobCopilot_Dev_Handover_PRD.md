# JobCopilot - 研发交接层架构与产品需求文档 (PRD)

这份文档旨在将 JobCopilot 的前端 UI 逻辑、后端服务要求以及 AI 架构深度结合，方便研发人员或 AI 工具（如 Codex）完成完整的系统构建与本地部署。

## 1. 核心架构与多模型协同方案 (Multi-Model AI PipeLine)

由于核心大脑（DeepSeek）目前擅长纯文本的高阶推理，缺乏原生的多模态（文件解析、视频、语音）能力。因此在系统架构上，我们采用**“组装工厂”模式（Multi-Model Pipeline）**。

### 1.1 文件与图片解析解析管线
为了读取用户任意格式的简历与 JD（PDF, Word, 图片截图）：
*   **路由解析层**：后端接收文件，判断 MIME Type。
*   **文本类 (PDF/Word)**：由后端脚本如 `pdf-parse` (Node.js) 或 `PyPDF2/pdfplumber` (Python)、`mammoth` 处理提取底层纯本文。
*   **图像类 (PNG/JPG/扫描件)**：后端转给 **开源 OCR 模型** (如 PaddleOCR 本地部署) 或 **云端视觉 API** (阿里云 OCR) 获取纯文本。
*   **统一输出**：将清洗去格式的纯文本变量 `resume_text` 作为 Context 参数，投喂给后续的中间件。

### 1.2 实时语音面试管线 (Voice-to-Voice Simulation)
*   **ASR (语音转文字)**：前端采集 Web Audio 发给后端，后端调用部署的 **Whisper** (OpenAI 发布的开源语音识别库) 将用户回答即时转录为高准确度的文字。
*   **LLM 推理主体 (DeepSeek)**：把转换好的文字加入到上下文 `messages` 中发给请求 DeepSeek 的接口，DeepSeek 根据人设 Prompt 判定当前是在考察哪个知识点，并输出下一句追问文本。
*   **TTS (文字转语音)**：后端将 DeepSeek 生成的回复传递给 TTS 引擎 (如国内的 豆包TTS/原声引擎，或系统的 Edge TTS) 合成并流式返回给前端客户端播放。

---

## 2. 数据库实体设计 (Database Schema Suggestions)

建议使用关系型数据库 (PostgreSQL/MySQL) 与 ORM 映射。核心表结构：

*   **User (用户表)**：`id`, `name`, `avatar`, `ai_preference_language` (语言), `ai_preference_style` (风格：温和/压力等)。
*   **Resume (简历表)**：`id`, `user_id`, `title`, `raw_text` (解析后的全本文本), `file_url` (对象存储链接), `tags`。
*   **Job (职位表)**：`id`, `user_id`, `company`, `role_title`, `jd_text`, `status`。
*   **InterviewSession (面试会话)**：`id`, `resume_id`, `job_id`, `match_score` (匹配度数字)，`strengths` (JSON节点), `weaknesses` (JSON节点), `overall_rating` (综合复盘分)。
*   **InterviewDialog (单句对话)**：`id`, `session_id`, `role` (user/ai), `content`, `extracted_skill` (AI为其标记的考点能力向)。
*   **Story (故事库)**：`id`, `user_id`, `title`, `source_dialog_id`, `star_situation`, `star_task`, `star_action`, `star_result`。

---

## 3. 核心后端接口业务逻辑 (Core API Workflows)

### 3.1 `POST /api/analysis` (准备与雷达分析)
*   **行为**：分析简历和 JD 的重合度。
*   **AI 调度**：向 DeepSeek 下发包含简历和 JD 的 Prompt，要求其必须以纯 JSON 格式输出，不可带 Markdown 代码块边界。
*   **输出要求**：`{ "matchScore": 85, "strengths": ["架构设计"], "weaknesses": ["缺乏C端经验"], "predictQuestions": ["..."] }`

### 3.2 `WS /api/interview/stream` (模拟面试双向流)
*   为了更低延迟，语音问答交互全过程使用 WebSocket 连接。
*   客户端持续推入分块的二进制音频数据 `<audio_blob>`。
*   后端工作台调度：`ASR 提取文案 -> DeepSeek 生成追问话术 -> TTS 合成话术音频` -> 向外侧推送 `<audio_blob>` 并附带刚生成的字幕 JSON。

### 3.3 `POST /api/sessions/{id}/review` (深度复盘生成)
*   **触发点**：用户点击面试结束，跳出面试循环。
*   **AI 调度**：将刚才表内关联的极长多轮对话一次性发给 DeepSeek 获取全局分。
*   **高阶运用**：提取回答最差或最长的一段对话，强制使用 STAR（情境、任务、行动、结果）重塑生成 `reframe_answer` 高分回答字段用于前端展示。

---

## 4. UI / UX 前端展现标准 (Frontend Design Rules)

给 Codex 进行前端还原开发时，必须遵循当前的抽象 UI 设计：

### 4.1 全局设计语言色彩与风格
*   **主背景**: `bg-slate-50` (`#f8fafc`) 呈现干净的轻拟物底色。背景存在浅色的点阵水印（CSS 伪元素 `radial-gradient`）提升工具质感。
*   **容器结构**: 大量使用圆角大卡片（`rounded-2xl`，`rounded-3xl`），所有卡片统一用无阴影描边或微轻阴影 `shadow-sm border border-slate-200`，绝不滥用重阴影。
*   **核心品牌色彩**: 
    1. 深色主背景/高优按钮组：深海夜灰 `slate-900` 
    2. 主题/辅助控件色：矢车菊靛蓝 `indigo-600`。
    3. 成功/优势面状态：翡翠绿 `emerald-600` 和背景 `bg-emerald-50` 组合。
*   **排版体系**:
    利用 `font-serif` 搭配加粗使用于各页面最大的 H1 标题上（如“设定目标岗位”），以提升工具的高级与权威感。其余控件内容完全拥抱 `ui-sans-serif` 系统级无衬线体。

### 4.2 响应式多端布局约束
*   **Desktop 大屏设备**：维持经典 SaaS 左导航（`w-72`宽度）右详情布局。右侧区最大宽度给死 `max-w-5xl` 并使用居中对齐 `mx-auto`，避免信息在一台 32 寸带鱼屏下疯狂拉升。
*   **Mobile 移动端设备**：干掉侧边栏，启用底部 Fixed Bottom-Bar `fixed bottom-0`，并追加毛玻璃滤镜层 `backdrop-blur-xl` 防背景内容穿透。工作区内的一切双排甚至多排栅格全部转场为 `flex-col` 单列纵向伸展。

### 4.3 UI交互体感动效
*   利用 `framer-motion` (Motion for React)，每个卡片路由加载统一应用 `y: 10 -> 0, opacity: 0 -> 1` 的浮现效果。
*   面试模拟界面的话筒点击后放大状态 `scale-110`，配以 `ring` 外发光或 `animate-ping` 营造沉浸收音的压迫感。
*   复盘重塑界面，左侧差强人意的回答与右侧深蓝色高亮底板包裹的重塑（满分）回答在视觉上要有明显的区块划分和视觉重心倾斜。
