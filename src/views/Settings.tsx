"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, Button } from "@/components/ui";
import {
  requestModelConfig,
  requestUserPreferences,
  saveModelConfig,
  saveUserPreferences,
  testModelConfig,
  type ModelConfig,
  type SettingsUserProfile,
  type UserPreferences,
} from "@/lib/api";
import { Bell, Bot, Check, KeyRound, PlugZap, Shield, User } from "lucide-react";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";

const providerDefaults = {
  mock: { model: "mock", baseUrl: "" },
  deepseek: { model: "deepseek-chat", baseUrl: "https://api.deepseek.com" },
  openai: { model: "gpt-4o-mini", baseUrl: "https://api.openai.com/v1" },
  qwen: { model: "qwen-plus", baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1" },
  kimi: { model: "moonshot-v1-8k", baseUrl: "https://api.moonshot.cn/v1" },
  custom: { model: "", baseUrl: "" },
} as const;

const defaultPreferences: UserPreferences = {
  interviewStyle: "friendly",
  interviewLanguage: "zh-CN",
  pressureMode: false,
  notificationsEnabled: true,
  reminderEnabled: true,
  weeklyReviewEnabled: false,
  updatedAt: "",
};

const tabs = [
  { id: "profile", label: "个人资料", icon: User },
  { id: "interview", label: "AI 面试偏好", icon: Bot },
  { id: "notifications", label: "通知与提醒", icon: Bell },
  { id: "security", label: "账号与安全", icon: Shield },
] as const;

const styleOptions = [
  { id: "friendly", title: "外企温和流 (Default)", helper: "鼓励式反馈，礼貌性深挖" },
  { id: "logic", title: "大厂逻辑流", helper: "直击痛点，重框架轻情绪" },
  { id: "challenge", title: "毒舌质疑流", helper: "极致施压，挑刺与反驳" },
] as const;

type Provider = keyof typeof providerDefaults;
type SettingsTab = (typeof tabs)[number]["id"];

export function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("interview");
  const [profile, setProfile] = useState<SettingsUserProfile | null>(null);
  const [profileName, setProfileName] = useState("");
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [savedPreferences, setSavedPreferences] = useState<UserPreferences>(defaultPreferences);
  const [modelConfig, setModelConfig] = useState<ModelConfig | null>(null);
  const [provider, setProvider] = useState<Provider>("mock");
  const [model, setModel] = useState("mock");
  const [baseUrl, setBaseUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [isSavingModel, setIsSavingModel] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [modelStatus, setModelStatus] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [preferenceStatus, setPreferenceStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([requestModelConfig(), requestUserPreferences()])
      .then(([modelData, preferenceData]) => {
        if (!active) return;
        setModelConfig(modelData.config);
        if (modelData.config) {
          setProvider(modelData.config.provider);
          setModel(modelData.config.model);
          setBaseUrl(modelData.config.baseUrl || "");
        }
        if (modelData.config?.warning) {
          setModelStatus({ type: "info", text: modelData.config.warning });
        }

        setProfile(preferenceData.user);
        setProfileName(preferenceData.user.name || "");
        setPreferences(preferenceData.preferences);
        setSavedPreferences(preferenceData.preferences);
      })
      .catch((error) => {
        if (!active) return;
        setModelStatus({ type: "error", text: error instanceof Error ? error.message : "设置读取失败" });
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
    setIsSavingModel(true);
    setModelStatus(null);
    try {
      const result = await saveModelConfig({ provider, model, baseUrl, apiKey });
      setModelConfig(result.config);
      setApiKey("");
      setModelStatus({ type: "success", text: "模型配置已保存" });
    } catch (error) {
      setModelStatus({ type: "error", text: error instanceof Error ? error.message : "模型配置保存失败" });
    } finally {
      setIsSavingModel(false);
    }
  };

  const savePreferences = async () => {
    setIsSavingPreferences(true);
    setPreferenceStatus(null);
    try {
      const result = await saveUserPreferences({ name: profileName, preferences });
      setProfile(result.user);
      setProfileName(result.user.name || "");
      setPreferences(result.preferences);
      setSavedPreferences(result.preferences);
      setPreferenceStatus({ type: "success", text: "偏好设置已保存" });
    } catch (error) {
      setPreferenceStatus({ type: "error", text: error instanceof Error ? error.message : "偏好设置保存失败" });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const resetPreferences = () => {
    setProfileName(profile?.name || "");
    setPreferences(savedPreferences);
    setPreferenceStatus(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
      <header>
        <h1 className="mb-2 font-serif text-4xl font-bold text-slate-900">系统偏好设置</h1>
        <p className="text-lg text-slate-500">定制属于你的 AI 面试官风格体系与训练偏好。</p>
      </header>

      <div className="grid gap-8 md:grid-cols-4">
        <div className="flex flex-col gap-2 md:col-span-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl p-3 text-left transition",
                activeTab === tab.id ? "bg-slate-900 font-semibold text-white shadow-md" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6 md:col-span-3">
          {activeTab === "profile" && (
            <Card className="flex flex-col gap-6 border-0 p-6 shadow-sm md:p-8">
              <SectionTitle title="个人资料" helper="用于侧边栏、训练记录和个性化提示展示。" />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="显示名称">
                  <input
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    placeholder="输入你的显示名称"
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </Field>
                <Field label="登录邮箱">
                  <input
                    value={profile?.email || ""}
                    disabled
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500 outline-none"
                  />
                </Field>
              </div>
            </Card>
          )}

          {activeTab === "interview" && (
            <>
              <Card className="flex flex-col gap-6 border-0 p-6 shadow-sm md:p-8">
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
                  <Field label="模型服务商">
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
                  </Field>
                  <Field label="模型名称">
                    <input
                      value={model}
                      onChange={(event) => setModel(event.target.value)}
                      placeholder="例如 deepseek-chat"
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                      disabled={isLoadingConfig}
                    />
                  </Field>
                </div>

                <Field label="Base URL">
                  <input
                    value={baseUrl}
                    onChange={(event) => setBaseUrl(event.target.value)}
                    placeholder="OpenAI-compatible endpoint"
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                    disabled={isLoadingConfig || provider === "mock"}
                  />
                </Field>

                <Field label="API Key">
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
                </Field>

                <StatusMessage status={modelStatus} />

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button variant="outline" className="gap-2" onClick={testConnection} disabled={isLoadingConfig || isTesting || provider === "mock"}>
                    <PlugZap size={17} /> {isTesting ? "测试中..." : "测试连接"}
                  </Button>
                  <Button className="gap-2 px-8 shadow-lg" onClick={saveConfig} disabled={isLoadingConfig || isSavingModel}>
                    {isSavingModel ? "保存中..." : "保存模型配置"}
                  </Button>
                </div>
              </Card>

              <Card className="flex flex-col gap-8 border-0 p-6 shadow-sm md:p-8">
                <h2 className="border-b border-slate-100 pb-4 text-xl font-bold">AI 面试环境配置</h2>
                <PreferenceToggle
                  title="开启压力面试模式"
                  helper="开启后，AI 将增加追问频率、发起对逻辑漏洞的反击式质疑，并模拟更高压的面试体感。"
                  checked={preferences.pressureMode}
                  onChange={(pressureMode) => setPreferences((current) => ({ ...current, pressureMode }))}
                />

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-6">
                  <label className="text-lg font-bold text-slate-900">AI 面试官话术风格</label>
                  <div className="mt-2 grid grid-cols-1 gap-3 md:grid-cols-3">
                    {styleOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setPreferences((current) => ({ ...current, interviewStyle: option.id }))}
                        className={cn(
                          "relative overflow-hidden rounded-xl p-4 text-center transition",
                          preferences.interviewStyle === option.id
                            ? "border-2 border-indigo-600 bg-indigo-50/50 text-indigo-700"
                            : "border border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50"
                        )}
                      >
                        {preferences.interviewStyle === option.id && (
                          <div className="absolute right-0 top-0 rounded-bl-lg bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">当前</div>
                        )}
                        <div className="mb-1 font-bold">{option.title}</div>
                        <div className="text-xs font-medium opacity-75">{option.helper}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-100 pt-6">
                  <label className="text-lg font-bold text-slate-900">默认面试语言</label>
                  <p className="mb-2 text-sm text-slate-500">设置后，模拟面试中的系统提问与语音识别将以此语言为准。</p>
                  <select
                    value={preferences.interviewLanguage}
                    onChange={(event) => setPreferences((current) => ({ ...current, interviewLanguage: event.target.value as UserPreferences["interviewLanguage"] }))}
                    className="max-w-sm cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="zh-CN">中文（普通话）</option>
                    <option value="en-US">English (US)</option>
                    <option value="mixed">中英混合模式</option>
                  </select>
                </div>
              </Card>
            </>
          )}

          {activeTab === "notifications" && (
            <Card className="flex flex-col gap-6 border-0 p-6 shadow-sm md:p-8">
              <SectionTitle title="通知与提醒" helper="控制训练提醒和复盘摘要入口，当前先保存偏好状态。" />
              <PreferenceToggle
                title="开启通知"
                helper="允许系统在站内展示训练提醒和重要状态提示。"
                checked={preferences.notificationsEnabled}
                onChange={(notificationsEnabled) => setPreferences((current) => ({ ...current, notificationsEnabled }))}
              />
              <PreferenceToggle
                title="训练提醒"
                helper="用于后续每日训练、待复盘面试和资料更新提醒。"
                checked={preferences.reminderEnabled}
                onChange={(reminderEnabled) => setPreferences((current) => ({ ...current, reminderEnabled }))}
              />
              <PreferenceToggle
                title="每周复盘摘要"
                helper="每周汇总训练得分、常见问题和故事库补全建议。"
                checked={preferences.weeklyReviewEnabled}
                onChange={(weeklyReviewEnabled) => setPreferences((current) => ({ ...current, weeklyReviewEnabled }))}
              />
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="flex flex-col gap-6 border-0 p-6 shadow-sm md:p-8">
              <SectionTitle title="账号与安全" helper="账号身份由 Supabase Auth 管理，敏感模型密钥仅后端加密保存。" />
              <div className="grid gap-4 md:grid-cols-2">
                <InfoBlock label="当前账号" value={profile?.email || "已登录用户"} />
                <InfoBlock label="模型密钥状态" value={modelConfig?.maskedKey ? `已保存 ${modelConfig.maskedKey}` : "未保存个人 API Key"} />
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium leading-relaxed text-slate-500">
                修改登录邮箱、密码和多因素认证请在 Supabase Auth 侧完成；JobCopilot 本地只保存训练偏好、资料资产和加密后的模型配置。
              </div>
            </Card>
          )}

          <StatusMessage status={preferenceStatus} />

          <div className="flex justify-end gap-3 px-2">
            <Button variant="ghost" onClick={resetPreferences} disabled={isSavingPreferences}>取消</Button>
            <Button className="px-8 shadow-lg" onClick={savePreferences} disabled={isLoadingConfig || isSavingPreferences}>
              {isSavingPreferences ? "保存中..." : "保存偏好更改"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionTitle({ title, helper }: { title: string; helper: string }) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{helper}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-slate-800">{label}</label>
      {children}
    </div>
  );
}

function PreferenceToggle({ title, helper, checked, onChange }: { title: string; helper: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span>
        <span className="block text-lg font-bold text-slate-900">{title}</span>
        <span className="mt-2 block max-w-3xl text-sm leading-relaxed text-slate-500">{helper}</span>
      </span>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          onChange(!checked);
        }}
        className={cn("flex h-6 w-12 shrink-0 items-center rounded-full p-1 shadow-inner transition-colors", checked ? "justify-end bg-indigo-600" : "justify-start bg-slate-300")}
        aria-pressed={checked}
      >
        <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
      </button>
    </label>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-900">
        <Check size={16} className="text-emerald-600" /> {value}
      </div>
    </div>
  );
}

function StatusMessage({ status }: { status: { type: "success" | "error" | "info"; text: string } | null }) {
  if (!status) return null;
  return (
    <div
      className={
        status.type === "success"
          ? "rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700"
          : status.type === "info"
            ? "rounded-2xl bg-indigo-50 p-4 text-sm font-bold text-indigo-700"
            : "rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-700"
      }
    >
      {status.text}
    </div>
  );
}
