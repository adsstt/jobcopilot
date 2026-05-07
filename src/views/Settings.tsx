"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Card, Button } from '@/components/ui';
import { requestModelConfig, saveModelConfig, testModelConfig, type ModelConfig } from '@/lib/api';
import { User, Bell, Shield, Bot, KeyRound, PlugZap } from 'lucide-react';
import * as motion from "motion/react-client";

const providerDefaults = {
   mock: { model: "mock", baseUrl: "" },
   deepseek: { model: "deepseek-chat", baseUrl: "https://api.deepseek.com" },
   openai: { model: "gpt-4o-mini", baseUrl: "https://api.openai.com/v1" },
   qwen: { model: "qwen-plus", baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1" },
   kimi: { model: "moonshot-v1-8k", baseUrl: "https://api.moonshot.cn/v1" },
   custom: { model: "", baseUrl: "" },
} as const;

type Provider = keyof typeof providerDefaults;

export function Settings() {
   const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);
   const [provider, setProvider] = useState<Provider>("mock");
   const [model, setModel] = useState("mock");
   const [baseUrl, setBaseUrl] = useState("");
   const [apiKey, setApiKey] = useState("");
   const [isLoadingConfig, setIsLoadingConfig] = useState(true);
   const [isTesting, setIsTesting] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const [modelStatus, setModelStatus] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

   useEffect(() => {
      let active = true;
      requestModelConfig()
         .then(({ config }) => {
            if (!active) return;
            setModelConfig(config);
            if (config) {
               setProvider(config.provider);
               setModel(config.model);
               setBaseUrl(config.baseUrl || "");
            }
            if (config?.warning) {
               setModelStatus({ type: "info", text: config.warning });
            }
         })
         .catch((error) => {
            if (active) setModelStatus({ type: "error", text: error instanceof Error ? error.message : "模型配置读取失败" });
         })
         .finally(() => {
            if (active) setIsLoadingConfig(false);
         });

      return () => {
         active = false;
      };
   }, []);

   const apiKeyPlaceholder = useMemo(() => {
      if (provider === "mock") return "mock provider 不需要 API Key";
      return modelConfig?.maskedKey ? `已保存：${modelConfig.maskedKey}` : "输入 API Key，仅后端加密保存";
   }, [modelConfig?.maskedKey, provider]);

   const onProviderChange = (nextProvider: Provider) => {
      setProvider(nextProvider);
      setModel(providerDefaults[nextProvider].model);
      setBaseUrl(providerDefaults[nextProvider].baseUrl);
      setApiKey("");
      setModelStatus(null);
   };

   const testConnection = async () => {
      setIsTesting(true);
      setModelStatus(null);
      try {
         const result = await testModelConfig({ provider, model, baseUrl, apiKey });
         setModelStatus({ type: "success", text: result.message || "模型连接成功" });
      } catch (error) {
         setModelStatus({ type: "error", text: error instanceof Error ? error.message : "模型连接失败" });
      } finally {
         setIsTesting(false);
      }
   };

   const saveConfig = async () => {
      setIsSaving(true);
      setModelStatus(null);
      try {
         const result = await saveModelConfig({ provider, model, baseUrl, apiKey });
         setModelConfig(result.config);
         setApiKey("");
         setModelStatus({ type: "success", text: "模型配置已保存" });
      } catch (error) {
         setModelStatus({ type: "error", text: error instanceof Error ? error.message : "模型配置保存失败" });
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
         <header>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">系统偏好设置</h1>
            <p className="text-slate-500 text-lg">定制属于你的 AI 面试官风格体系与训练偏好。</p>
         </header>

         <div className="grid md:grid-cols-4 gap-8">
             {/* 侧边设置导航 */}
             <div className="md:col-span-1 flex flex-col gap-2">
                <button className="flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"><User size={18}/> 个人资料</button>
                <button className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 text-white font-semibold shadow-md"><Bot size={18}/> AI 面试偏好</button>
                <button className="flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"><Bell size={18}/> 通知与提醒</button>
                <button className="flex items-center gap-3 p-3 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"><Shield size={18}/> 账号与安全</button>
             </div>

             {/* 核心设置内容 */}
             <div className="md:col-span-3 flex flex-col gap-6">
                <Card className="p-6 md:p-8 flex flex-col gap-6 border-0 shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-bold">AI 模型设置</h2>
                            <p className="mt-1 text-sm text-slate-500">优先使用你的个人模型配置；未配置时自动回退环境变量，再回退 mock。</p>
                        </div>
                        {modelConfig?.maskedKey && (
                            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                <KeyRound size={14} /> {modelConfig.maskedKey}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-800">模型服务商</label>
                            <select
                                value={provider}
                                onChange={(event) => onProviderChange(event.target.value as Provider)}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                disabled={isLoadingConfig}
                            >
                                <option value="mock">mock</option>
                                <option value="deepseek">deepseek</option>
                                <option value="openai">openai</option>
                                <option value="qwen">qwen</option>
                                <option value="kimi">kimi</option>
                                <option value="custom">custom</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-800">模型名称</label>
                            <input
                                value={model}
                                onChange={(event) => setModel(event.target.value)}
                                placeholder="例如 deepseek-chat"
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                                disabled={isLoadingConfig}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800">Base URL</label>
                        <input
                            value={baseUrl}
                            onChange={(event) => setBaseUrl(event.target.value)}
                            placeholder="OpenAI-compatible endpoint"
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                            disabled={isLoadingConfig || provider === "mock"}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800">API Key</label>
                        <input
                            type="password"
                            value={apiKey}
                            onChange={(event) => setApiKey(event.target.value)}
                            placeholder={apiKeyPlaceholder}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                            disabled={isLoadingConfig || provider === "mock"}
                            autoComplete="new-password"
                        />
                        <p className="text-xs font-medium text-slate-500">API Key 只会发送到后端并加密保存，前端不会保存明文。</p>
                    </div>

                    {modelStatus && (
                        <div
                            className={
                                modelStatus.type === "success"
                                    ? "rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700"
                                    : modelStatus.type === "info"
                                      ? "rounded-2xl bg-indigo-50 p-4 text-sm font-bold text-indigo-700"
                                      : "rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700"
                            }
                        >
                            {modelStatus.text}
                        </div>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <Button variant="outline" className="gap-2" onClick={testConnection} disabled={isLoadingConfig || isTesting || provider === "mock"}>
                            <PlugZap size={17} /> {isTesting ? "测试中..." : "测试连接"}
                        </Button>
                        <Button className="gap-2 shadow-lg px-8" onClick={saveConfig} disabled={isLoadingConfig || isSaving}>
                            {isSaving ? "保存中..." : "保存模型配置"}
                        </Button>
                    </div>
                </Card>

                <Card className="p-6 md:p-8 flex flex-col gap-8 border-0 shadow-sm">
                    <h2 className="text-xl font-bold border-b border-slate-100 pb-4">AI 面试环境配置</h2>
                    
                    <div className="flex flex-col gap-2">
                        <label className="font-bold text-slate-900 flex justify-between items-center cursor-pointer">
                            <span className="text-lg">开启压力面试模式</span>
                            <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center p-1 justify-end transition-colors shadow-inner">
                                <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </label>
                        <p className="text-sm text-slate-500 leading-relaxed pr-12">
                            开启后，AI 将启用严格模式：增加追问频率、发起对逻辑漏洞的反击式质疑，并模拟高并发环境下的高压外企或大厂面试体感。建议在有充分准备后开启。
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                        <label className="font-bold text-slate-900 text-lg">AI 面试官话术风格</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                            <div className="border-2 border-indigo-600 bg-indigo-50/50 text-indigo-700 p-4 rounded-xl text-center cursor-pointer transition relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">当前</div>
                                <div className="font-bold mb-1">外企温和流 (Default)</div>
                                <div className="text-xs text-indigo-600/70 font-medium">鼓励式反馈，礼貌性深挖</div>
                            </div>
                            <div className="border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 p-4 rounded-xl text-center cursor-pointer transition">
                                <div className="font-bold text-slate-700 mb-1">大厂逻辑流</div>
                                <div className="text-xs text-slate-500">直击痛点，重框架轻情绪</div>
                            </div>
                            <div className="border border-slate-200 hover:border-red-300 hover:bg-red-50 p-4 rounded-xl text-center cursor-pointer transition group">
                                <div className="font-bold text-slate-700 group-hover:text-red-700 mb-1">毒舌质疑流</div>
                                <div className="text-xs text-slate-500 group-hover:text-red-600/70">极致施压，挑刺与反驳</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
                        <label className="font-bold text-slate-900 text-lg">默认面试语言</label>
                        <p className="text-sm text-slate-500 mb-2">设置后，模拟面试中的系统提问与语音识别将以此语言为准。</p>
                        <select className="bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 font-medium max-w-sm appearance-none cursor-pointer">
                            <option>中文 (普通话)</option>
                            <option>English (US)</option>
                            <option>中英混合模式 (夹杂职场黑话识别)</option>
                        </select>
                    </div>
                </Card>

                <div className="flex justify-end gap-3 px-2">
                    <Button variant="ghost">取消</Button>
                    <Button className="shadow-lg px-8">保存偏好更改</Button>
                </div>
             </div>
         </div>
      </motion.div>
   )
}
