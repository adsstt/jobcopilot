import type { UserModelConfig } from "@prisma/client";
import { decryptModelApiKey, encryptModelApiKey, getModelConfigSecretWarning } from "../security/modelConfigCrypto";
import { prisma } from "./client";

export const supportedModelProviders = ["mock", "deepseek", "openai", "qwen", "kimi", "custom"] as const;
export type SupportedModelProvider = (typeof supportedModelProviders)[number];

export interface ModelProviderConfig {
  provider: SupportedModelProvider;
  model: string;
  baseUrl?: string;
  apiKey?: string;
}

export interface SaveModelConfigInput {
  userId: string;
  provider: string;
  model: string;
  baseUrl?: string;
  apiKey?: string;
}

export interface SafeModelConfig {
  id: string;
  provider: SupportedModelProvider;
  model: string;
  baseUrl: string | null;
  maskedKey: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  warning: string | null;
}

export const providerDefaults: Record<SupportedModelProvider, { baseUrl: string; model: string; requiresKey: boolean }> = {
  mock: { baseUrl: "", model: "mock", requiresKey: false },
  openai: { baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini", requiresKey: true },
  deepseek: { baseUrl: "https://api.deepseek.com", model: "deepseek-chat", requiresKey: true },
  qwen: { baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1", model: "qwen-plus", requiresKey: true },
  kimi: { baseUrl: "https://api.moonshot.cn/v1", model: "moonshot-v1-8k", requiresKey: true },
  custom: { baseUrl: "", model: "", requiresKey: true },
};

export async function getSafeDefaultModelConfig(userId: string): Promise<SafeModelConfig | null> {
  const config = await prisma.userModelConfig.findFirst({
    where: { userId, isDefault: true },
    orderBy: { updatedAt: "desc" },
  });

  return config ? toSafeModelConfig(config) : null;
}

export async function getDecryptedDefaultModelConfig(userId: string): Promise<ModelProviderConfig | null> {
  const config = await prisma.userModelConfig.findFirst({
    where: { userId, isDefault: true },
    orderBy: { updatedAt: "desc" },
  });

  if (!config) return null;

  const provider = normalizeProvider(config.provider);
  const apiKey = config.apiKeyEncrypted ? decryptModelApiKey(config.apiKeyEncrypted) : undefined;
  const defaults = providerDefaults[provider];

  if (provider !== "mock" && defaults.requiresKey && !apiKey) return null;
  if (provider === "custom" && !config.baseUrl) return null;

  return {
    provider,
    model: config.model || defaults.model,
    baseUrl: config.baseUrl || defaults.baseUrl,
    apiKey,
  };
}

export async function saveDefaultModelConfig(input: SaveModelConfigInput): Promise<SafeModelConfig> {
  const provider = normalizeProvider(input.provider);
  const existing = await prisma.userModelConfig.findFirst({
    where: { userId: input.userId, isDefault: true },
    orderBy: { updatedAt: "desc" },
  });

  const defaults = providerDefaults[provider];
  const model = (input.model || defaults.model || provider).trim();
  const baseUrl = normalizeBaseUrl(input.baseUrl || defaults.baseUrl);
  const apiKeyEncrypted = input.apiKey?.trim()
    ? encryptModelApiKey(input.apiKey.trim())
    : existing?.apiKeyEncrypted;

  if (provider !== "mock" && provider !== "custom" && !model) {
    throw new Error("Model name is required.");
  }

  if (provider === "custom" && !baseUrl) {
    throw new Error("Base URL is required for custom OpenAI-compatible providers.");
  }

  if (provider !== "mock" && !apiKeyEncrypted) {
    throw new Error("API Key is required for this provider.");
  }

  const config = await prisma.$transaction(async (tx) => {
    await tx.userModelConfig.updateMany({
      where: { userId: input.userId, isDefault: true },
      data: { isDefault: false },
    });

    if (existing) {
      return tx.userModelConfig.update({
        where: { id: existing.id },
        data: {
          provider,
          model,
          baseUrl,
          apiKeyEncrypted: provider === "mock" ? null : apiKeyEncrypted,
          isDefault: true,
        },
      });
    }

    return tx.userModelConfig.create({
      data: {
        userId: input.userId,
        provider,
        model,
        baseUrl,
        apiKeyEncrypted: provider === "mock" ? null : apiKeyEncrypted,
        isDefault: true,
      },
    });
  });

  return toSafeModelConfig(config);
}

export function maskApiKey(apiKey?: string | null) {
  if (!apiKey) return null;
  if (apiKey.length <= 8) return "****";
  return `${apiKey.slice(0, 3)}****${apiKey.slice(-4)}`;
}

export function normalizeProvider(provider: string): SupportedModelProvider {
  const normalized = provider.toLowerCase().trim();
  if (supportedModelProviders.includes(normalized as SupportedModelProvider)) {
    return normalized as SupportedModelProvider;
  }
  return "mock";
}

function toSafeModelConfig(config: UserModelConfig): SafeModelConfig {
  let maskedKey: string | null = null;

  if (config.apiKeyEncrypted) {
    try {
      maskedKey = maskApiKey(decryptModelApiKey(config.apiKeyEncrypted));
    } catch {
      maskedKey = "****";
    }
  }

  return {
    id: config.id,
    provider: normalizeProvider(config.provider),
    model: config.model,
    baseUrl: config.baseUrl,
    maskedKey,
    isDefault: config.isDefault,
    createdAt: config.createdAt.toISOString(),
    updatedAt: config.updatedAt.toISOString(),
    warning: getModelConfigSecretWarning(),
  };
}

function normalizeBaseUrl(baseUrl?: string) {
  const value = baseUrl?.trim();
  return value ? value.replace(/\/$/, "") : null;
}
