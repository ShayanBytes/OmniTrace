"use client";

import * as React from "react";
import { Check } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProviderLogo } from "@/components/shared/provider-logo";
import { cn } from "@/lib/utils";
import {
  PROVIDER_LIST,
  PROVIDERS,
  type ProviderId,
  type Settings,
} from "@/lib/providers";

export function SettingsDialog({
  open,
  settings,
  onClose,
  onSave,
}: {
  open: boolean;
  settings: Settings;
  onClose: () => void;
  onSave: (s: Settings) => void;
}) {
  const [draft, setDraft] = React.useState<Settings>(settings);

  // Re-sync the draft whenever the dialog is (re)opened.
  React.useEffect(() => {
    if (open) setDraft(settings);
  }, [open, settings]);

  const cfg = PROVIDERS[draft.provider];

  function pickProvider(id: ProviderId) {
    const p = PROVIDERS[id];
    setDraft((d) => ({
      ...d,
      provider: id,
      model: p.defaultModel || d.model,
      baseUrl: p.needsBaseUrl ? d.baseUrl : "",
    }));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>AI provider</DialogTitle>
          <DialogDescription>
            Choose where analysis runs. Local models keep everything on your
            machine; cloud providers use your own key (never stored on a server).
          </DialogDescription>
        </DialogHeader>

        {/* Provider grid */}
        <div className="grid grid-cols-2 gap-2">
          {PROVIDER_LIST.map((p) => {
            const active = draft.provider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => pickProvider(p.id)}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl p-3 text-left ring-1 transition",
                  active
                    ? "bg-excav-violet/20 ring-excav-violet/70"
                    : "bg-black/30 ring-white/10 hover:ring-white/25"
                )}
              >
                <span className="mt-0.5 text-excav-lilac">
                  <ProviderLogo id={p.id} className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-slate-100">
                    {p.label}
                  </span>
                  <span className="block truncate text-[11px] text-slate-400">
                    {p.tagline}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Model + credentials */}
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-300">Model</span>
            <input
              list="model-suggestions"
              value={draft.model}
              onChange={(e) => setDraft((d) => ({ ...d, model: e.target.value }))}
              placeholder={cfg.defaultModel || "model name"}
              className="w-full rounded-xl bg-black/40 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-excav-violet/70"
            />
            <datalist id="model-suggestions">
              {cfg.models.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </label>

          {cfg.needsBaseUrl && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-300">Base URL</span>
              <input
                value={draft.baseUrl}
                onChange={(e) => setDraft((d) => ({ ...d, baseUrl: e.target.value }))}
                placeholder={cfg.baseUrlPlaceholder}
                className="w-full rounded-xl bg-black/40 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-excav-violet/70"
              />
            </label>
          )}

          {cfg.needsKey && (
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-slate-300">API key</span>
              <input
                type="password"
                value={draft.apiKey}
                onChange={(e) => setDraft((d) => ({ ...d, apiKey: e.target.value }))}
                placeholder="sk-…"
                className="w-full rounded-xl bg-black/40 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-excav-violet/70"
              />
              {cfg.keyHelp && (
                <span className="text-[11px] text-slate-500">{cfg.keyHelp}</span>
              )}
              <label className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                <input
                  type="checkbox"
                  checked={draft.rememberKey}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, rememberKey: e.target.checked }))
                  }
                  className="h-3.5 w-3.5 accent-excav-violet"
                />
                Remember key on this device
              </label>
            </label>
          )}

          {cfg.help && (
            <p className="rounded-lg bg-white/[0.03] p-3 text-[11px] leading-relaxed text-slate-400 ring-1 ring-white/5">
              {cfg.help}
            </p>
          )}
        </div>

        <div className="mt-1 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gradient" size="sm" onClick={() => onSave(draft)}>
            <Check className="h-4 w-4" />
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
