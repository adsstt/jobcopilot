import { getCurrentUser } from "../auth/getCurrentUser";
import { getDecryptedDefaultModelConfig, providerDefaults, type ModelProviderConfig } from "../db/modelConfigs";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  responseFormat?: "json";
}

interface ProviderConfig {
  provider: string;
  apiKey?: string;
  baseUrl?: string;
  model: string;
}

function getEnvProviderConfig(): ProviderConfig {
  const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();
  const defaults = providerDefaults[provider as keyof typeof providerDefaults] ?? providerDefaults.openai;

  return {
    provider,
    apiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY || process.env.QWEN_API_KEY || process.env.KIMI_API_KEY,
    baseUrl: process.env.AI_BASE_URL || defaults.baseUrl,
    model: process.env.AI_MODEL || defaults.model,
  };
}

function isMockConfig(config: ProviderConfig | ModelProviderConfig | null | undefined) {
  return !config || config.provider === "mock" || !config.apiKey;
}

export async function isMockProvider() {
  const configs = await getProviderCandidates();
  return configs.every((config) => isMockConfig(config));
}

export async function chatCompletion(messages: ChatMessage[], options: ChatOptions = {}) {
  const configs = await getProviderCandidates();
  let lastError: Error | null = null;

  for (const config of configs) {
    if (isMockConfig(config)) continue;
    try {
      return await callChatCompletion(config, messages, options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("AI request failed.");
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error("AI provider is mock or API key is missing.");
}

export async function testChatCompletion(config: ProviderConfig) {
  if (isMockConfig(config)) {
    throw new Error("AI provider is mock or API key is missing.");
  }

  return callChatCompletion(
    config,
    [
      { role: "system", content: "You are a connection test assistant. Reply with plain text only." },
      { role: "user", content: "Reply with ok." },
    ],
    { temperature: 0 }
  );
}

async function callChatCompletion(config: ProviderConfig | ModelProviderConfig, messages: ChatMessage[], options: ChatOptions = {}) {
  const response = await fetch(`${config.baseUrl?.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: options.temperature ?? 0.3,
      response_format: options.responseFormat === "json" ? { type: "json_object" } : undefined,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI request failed: ${response.status} ${text.slice(0, 500)}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("AI response did not include message content.");
  }

  return content;
}

export async function generateJson<T>(messages: ChatMessage[], mockValue: T): Promise<T> {
  const configs = await getProviderCandidates();

  for (const config of configs) {
    if (isMockConfig(config)) continue;
    try {
      const content = await callChatCompletion(config, messages, { responseFormat: "json", temperature: 0.2 });
      return parseJsonContent<T>(content);
    } catch {
      continue;
    }
  }

  return mockValue;
}

export async function streamJsonWithDeltas<T extends Record<string, any>>(
  messages: ChatMessage[],
  mockValue: T,
  options: {
    displayKey: keyof T;
    onDelta: (text: string) => void | Promise<void>;
  }
): Promise<T> {
  const configs = await getProviderCandidates();

  for (const config of configs) {
    if (isMockConfig(config)) continue;

    try {
      let fullText = "";
      let emittedLength = 0;

      for await (const chunk of callStreamingChatCompletion(config, messages, { responseFormat: "json", temperature: 0.2 })) {
        fullText += chunk;
        const displayText = extractJsonStringValue(fullText, String(options.displayKey));
        if (displayText.length > emittedLength) {
          const delta = displayText.slice(emittedLength);
          emittedLength = displayText.length;
          await options.onDelta(delta);
        }
      }

      const result = parseJsonContent<T>(fullText);
      const finalDisplay = String(result[options.displayKey] || "");
      if (finalDisplay.length > emittedLength) {
        await options.onDelta(finalDisplay.slice(emittedLength));
      }
      return result;
    } catch {
      continue;
    }
  }

  await streamMockDisplay(String(mockValue[options.displayKey] || ""), options.onDelta);
  return mockValue;
}

async function getProviderCandidates(): Promise<Array<ProviderConfig | ModelProviderConfig>> {
  const candidates: Array<ProviderConfig | ModelProviderConfig> = [];

  try {
    const user = await getCurrentUser();
    const userConfig = await getDecryptedDefaultModelConfig(user.id);
    if (userConfig) candidates.push(userConfig);
  } catch {
    // If user config cannot be resolved or decrypted, continue to env fallback.
  }

  candidates.push(getEnvProviderConfig());
  candidates.push({ provider: "mock", model: "mock", baseUrl: "" });

  return candidates;
}

async function* callStreamingChatCompletion(config: ProviderConfig | ModelProviderConfig, messages: ChatMessage[], options: ChatOptions = {}) {
  const response = await fetch(`${config.baseUrl?.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: options.temperature ?? 0.3,
      stream: true,
      response_format: options.responseFormat === "json" ? { type: "json_object" } : undefined,
    }),
  });

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => "");
    throw new Error(`AI stream failed: ${response.status} ${text.slice(0, 500)}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return;

      const parsed = JSON.parse(data);
      const content = parsed?.choices?.[0]?.delta?.content;
      if (typeof content === "string" && content) {
        yield content;
      }
    }
  }
}

async function streamMockDisplay(text: string, onDelta: (text: string) => void | Promise<void>) {
  const parts = text.match(/.{1,3}/gs) || [];
  for (const part of parts) {
    await onDelta(part);
    await new Promise((resolve) => setTimeout(resolve, 28));
  }
}

function extractJsonStringValue(jsonText: string, key: string) {
  const keyPattern = `"${key}"`;
  const keyIndex = jsonText.indexOf(keyPattern);
  if (keyIndex < 0) return "";

  const colonIndex = jsonText.indexOf(":", keyIndex + keyPattern.length);
  if (colonIndex < 0) return "";

  let cursor = colonIndex + 1;
  while (cursor < jsonText.length && /\s/.test(jsonText[cursor])) cursor += 1;
  if (jsonText[cursor] !== '"') return "";
  cursor += 1;

  let value = "";
  let escaping = false;

  for (; cursor < jsonText.length; cursor += 1) {
    const char = jsonText[cursor];
    if (escaping) {
      value += unescapeJsonChar(char);
      escaping = false;
      continue;
    }
    if (char === "\\") {
      escaping = true;
      continue;
    }
    if (char === '"') break;
    value += char;
  }

  return value;
}

function unescapeJsonChar(char: string) {
  if (char === "n") return "\n";
  if (char === "r") return "\r";
  if (char === "t") return "\t";
  if (char === "b") return "\b";
  if (char === "f") return "\f";
  return char;
}

function parseJsonContent<T>(content: string): T {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const jsonText = fenced?.[1] ?? trimmed;

  try {
    return JSON.parse(jsonText) as T;
  } catch {
    const start = jsonText.indexOf("{");
    const end = jsonText.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(jsonText.slice(start, end + 1)) as T;
    }
    throw new Error("Unable to parse AI JSON response.");
  }
}
