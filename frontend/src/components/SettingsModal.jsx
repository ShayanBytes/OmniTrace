// SettingsModal.jsx
// The "bring your own AI" control panel. Lets the user pick a provider,
// type/choose any model, paste their own API key, and (for custom or local
// servers) set a base URL. Nothing here is required to use the local Ollama
// default — cloud fields only appear when the chosen provider needs them.
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROVIDERS, PROVIDER_LIST } from "../providers.js";

export default function SettingsModal({ open, settings, onClose, onSave }) {
  // Local draft so edits aren't applied until the user hits Save.
  const [draft, setDraft] = useState(settings);
  const [showKey, setShowKey] = useState(false);

  // Re-seed the draft whenever the modal is (re)opened.
  useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);

  const provider = PROVIDERS[draft.provider];

  // Switching provider resets the model to that provider's default so we
  // never send an OpenAI model name to Anthropic, etc.
  function pickProvider(id) {
    const p = PROVIDERS[id];
    setDraft((d) => ({
      ...d,
      provider: id,
      model: p.defaultModel,
      baseUrl: p.needsBaseUrl ? d.baseUrl : "",
    }));
  }

  function update(field, value) {
    setDraft((d) => ({ ...d, [field]: value }));
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative my-8 w-full max-w-lg rounded-3xl p-6 shadow-glow"
          >
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-100">AI provider</h2>
                <p className="text-xs text-slate-400">
                  Bring your own model & key. Keys are sent only with your
                  analysis request and never stored on the server.
                </p>
              </div>
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Provider picker */}
            <div className="grid grid-cols-2 gap-2">
              {PROVIDER_LIST.map((p) => {
                const active = draft.provider === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => pickProvider(p.id)}
                    className={`rounded-xl p-3 text-left ring-1 transition ${
                      active
                        ? "bg-excav-violet/20 ring-excav-violet/70"
                        : "bg-black/30 ring-white/10 hover:ring-white/25"
                    }`}
                  >
                    <div className="text-sm font-semibold text-slate-100">{p.label}</div>
                    <div className="text-[11px] text-slate-400">{p.tagline}</div>
                  </button>
                );
              })}
            </div>

            <p className="mt-3 rounded-lg bg-black/30 p-2.5 text-[11px] text-slate-400 ring-1 ring-white/5">
              {provider.help}
            </p>

            {/* Model — free text with suggestions (fully dynamic) */}
            <Field label="Model" className="mt-4">
              <input
                list="model-suggestions"
                value={draft.model}
                onChange={(e) => update("model", e.target.value)}
                placeholder={provider.defaultModel || "type a model name"}
                className="input"
              />
              <datalist id="model-suggestions">
                {provider.models.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
              <span className="mt-1 block text-[11px] text-slate-500">
                Pick a suggestion or type any model the provider supports.
              </span>
            </Field>

            {/* API key — only for providers that need one */}
            {provider.needsKey && (
              <Field label="API key" className="mt-4">
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={draft.apiKey}
                    onChange={(e) => update("apiKey", e.target.value)}
                    placeholder="sk-…"
                    autoComplete="off"
                    spellCheck={false}
                    className="input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                  >
                    {showKey ? "hide" : "show"}
                  </button>
                </div>
                {provider.keyHelp && (
                  <span className="mt-1 block text-[11px] text-slate-500">
                    {provider.keyHelp}
                  </span>
                )}
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-[11px] text-slate-400">
                  <input
                    type="checkbox"
                    checked={draft.rememberKey}
                    onChange={(e) => update("rememberKey", e.target.checked)}
                    className="h-3.5 w-3.5 accent-violet-500"
                  />
                  Remember key on this device (stored in your browser only)
                </label>
              </Field>
            )}

            {/* Base URL — for custom providers, or optional Ollama override */}
            {(provider.needsBaseUrl || draft.provider === "ollama") && (
              <Field
                label={provider.needsBaseUrl ? "Base URL" : "Base URL (optional)"}
                className="mt-4"
              >
                <input
                  value={draft.baseUrl}
                  onChange={(e) => update("baseUrl", e.target.value)}
                  placeholder={provider.baseUrlPlaceholder}
                  className="input"
                />
              </Field>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10 transition hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(draft)}
                className="rounded-xl bg-gradient-to-r from-excav-violet to-excav-violetBright px-5 py-2 text-sm font-semibold text-white ring-1 ring-white/15 transition hover:opacity-90"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Small labelled-field wrapper. The `.input` class is defined inline below
// via a shared className string to keep the markup tidy.
function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}
