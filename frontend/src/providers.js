/**
 * providers.js
 * ------------
 * The single source of truth for the "bring your own AI" feature.
 *
 * Every provider here maps 1:1 to a branch in the backend's brain.py
 * (ollama | openai | anthropic | custom). For each one we describe:
 *   - what fields the user needs to fill in (key? base url?)
 *   - a handful of suggested models (the model field stays a free-text
 *     input with a datalist, so ANY model name is allowed — fully dynamic)
 *   - sensible defaults and help text
 *
 * Adding a new OpenAI-compatible service (Groq, OpenRouter, Together,
 * LM Studio, vLLM, ...) needs NO backend change — the user just picks
 * "Custom" and pastes a base URL.
 */

export const PROVIDERS = {
  ollama: {
    id: "ollama",
    label: "Ollama",
    tagline: "Local · free · private",
    needsKey: false,
    needsBaseUrl: false, // optional override only
    defaultBaseUrl: "http://localhost:11434",
    baseUrlPlaceholder: "http://localhost:11434",
    defaultModel: "llama3",
    models: [
      "llama3",
      "llama3.1",
      "llama3.2",
      "qwen2.5-coder",
      "codellama",
      "mistral",
      "phi3",
      "gemma2",
    ],
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
    models: [
      "claude-opus-4-8",
      "claude-sonnet-4-6",
      "claude-haiku-4-5-20251001",
      "claude-fable-5",
    ],
    help: "Uses Anthropic's Claude Messages API with your own key.",
    keyHelp:
      "Create a key at console.anthropic.com → API keys (starts with sk-ant-).",
  },

  custom: {
    id: "custom",
    label: "Custom / OpenAI-compatible",
    tagline: "Groq · OpenRouter · LM Studio · …",
    needsKey: true, // most need one; LM Studio etc. accept any string
    needsBaseUrl: true,
    defaultBaseUrl: "",
    baseUrlPlaceholder: "https://api.groq.com/openai/v1",
    defaultModel: "",
    models: [
      "llama-3.3-70b-versatile",
      "deepseek-r1-distill-llama-70b",
      "mixtral-8x7b-32768",
      "meta-llama/llama-3.1-70b-instruct",
    ],
    help: "Any service that speaks the OpenAI /chat/completions format. Paste its base URL and (if required) a key.",
    keyHelp:
      "For local servers like LM Studio you can usually enter any non-empty value.",
  },
};

export const PROVIDER_LIST = Object.values(PROVIDERS);

// What a fresh settings object looks like. Stored in localStorage so the
// user doesn't re-enter everything each visit.
export function defaultSettings() {
  return {
    provider: "ollama",
    model: PROVIDERS.ollama.defaultModel,
    apiKey: "",
    baseUrl: "",
    rememberKey: false, // when false we keep the key in memory only
  };
}

const STORAGE_KEY = "code-archaeologist.settings";

/**
 * Load settings from localStorage, falling back to sane defaults.
 * If the user opted NOT to remember their key, we drop it on load.
 */
export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings();
    const parsed = JSON.parse(raw);
    const merged = { ...defaultSettings(), ...parsed };
    if (!merged.rememberKey) merged.apiKey = "";
    return merged;
  } catch {
    return defaultSettings();
  }
}

/**
 * Persist settings. The API key is only written to disk when the user
 * ticked "remember key on this device" — otherwise it lives in React
 * state for the session and is blanked out in storage.
 */
export function saveSettings(settings) {
  try {
    const toStore = { ...settings };
    if (!settings.rememberKey) toStore.apiKey = "";
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    /* storage may be unavailable (private mode) — non-fatal */
  }
}
