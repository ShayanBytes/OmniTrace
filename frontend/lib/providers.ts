/**
 * Provider config + settings persistence for the "bring your own AI" feature.
 * Each provider maps 1:1 to a branch in the backend's brain.py
 * (ollama | openai | anthropic | custom). The model field stays free-text with
 * datalist suggestions, so any model name the provider supports is allowed.
 */

export type ProviderId = "ollama" | "openai" | "anthropic" | "custom";

export type ProviderConfig = {
  id: ProviderId;
  label: string;
  tagline: string;
  needsKey: boolean;
  needsBaseUrl: boolean;
  defaultBaseUrl: string;
  baseUrlPlaceholder: string;
  defaultModel: string;
  models: string[];
  help: string;
  keyHelp: string;
};

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  ollama: {
    id: "ollama",
    label: "Ollama",
    tagline: "Local · free · private",
    needsKey: false,
    needsBaseUrl: false,
    defaultBaseUrl: "http://localhost:11434",
    baseUrlPlaceholder: "http://localhost:11434",
    defaultModel: "llama3",
    models: ["llama3", "llama3.1", "llama3.2", "qwen2.5-coder", "codellama", "mistral", "phi3", "gemma2"],
    help: "Runs entirely on your machine via Ollama. No API key, nothing leaves your computer. Make sure `ollama serve` is running.",
    keyHelp: "",
  },
  openai: {
    id: "openai",
    label: "OpenAI",
    tagline: "GPT models · your key",
    needsKey: true,
    needsBaseUrl: false,
    defaultBaseUrl: "https://api.openai.com/v1",
    baseUrlPlaceholder: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "gpt-4.1-mini", "o3-mini"],
    help: "Uses the OpenAI Chat Completions API with your own key.",
    keyHelp: "Create a key at platform.openai.com → API keys (starts with sk-).",
  },
  anthropic: {
    id: "anthropic",
    label: "Anthropic",
    tagline: "Claude models · your key",
    needsKey: true,
    needsBaseUrl: false,
    defaultBaseUrl: "https://api.anthropic.com",
    baseUrlPlaceholder: "https://api.anthropic.com",
    defaultModel: "claude-haiku-4-5-20251001",
    models: ["claude-opus-4-8", "claude-sonnet-4-6", "claude-haiku-4-5-20251001", "claude-fable-5"],
    help: "Uses Anthropic's Claude Messages API with your own key.",
    keyHelp: "Create a key at console.anthropic.com → API keys (starts with sk-ant-).",
  },
  custom: {
    id: "custom",
    label: "Custom / OpenAI-compatible",
    tagline: "Groq · OpenRouter · LM Studio · …",
    needsKey: true,
    needsBaseUrl: true,
    defaultBaseUrl: "",
    baseUrlPlaceholder: "https://api.groq.com/openai/v1",
    defaultModel: "",
    models: ["llama-3.3-70b-versatile", "deepseek-r1-distill-llama-70b", "mixtral-8x7b-32768", "meta-llama/llama-3.1-70b-instruct"],
    help: "Any service that speaks the OpenAI /chat/completions format. Paste its base URL and (if required) a key.",
    keyHelp: "For local servers like LM Studio you can usually enter any non-empty value.",
  },
};

export const PROVIDER_LIST = Object.values(PROVIDERS);

export type Settings = {
  provider: ProviderId;
  model: string;
  apiKey: string;
  baseUrl: string;
  rememberKey: boolean;
};

export function defaultSettings(): Settings {
  return {
    provider: "ollama",
    model: PROVIDERS.ollama.defaultModel,
    apiKey: "",
    baseUrl: "",
    rememberKey: false,
  };
}

const STORAGE_KEY = "omnitrace.settings";

/** Load settings from localStorage (SSR-safe), dropping the key if not remembered. */
export function loadSettings(): Settings {
  if (typeof window === "undefined") return defaultSettings();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings();
    const merged = { ...defaultSettings(), ...JSON.parse(raw) } as Settings;
    if (!merged.rememberKey) merged.apiKey = "";
    return merged;
  } catch {
    return defaultSettings();
  }
}

/** Persist settings; only write the key to disk when "remember" is on. */
export function saveSettings(settings: Settings): void {
  if (typeof window === "undefined") return;
  try {
    const toStore = { ...settings };
    if (!settings.rememberKey) toStore.apiKey = "";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    /* storage unavailable (private mode) — non-fatal */
  }
}
