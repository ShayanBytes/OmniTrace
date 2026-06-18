"use client";

import * as React from "react";
import { Loader2, Sparkles, Copy, Check, AlertTriangle } from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { splitPath } from "@/lib/risk";
import type { GraveyardFile } from "@/lib/mock-data";

export type ReportState = {
  file: GraveyardFile;
  loading: boolean;
  error?: string;
  report?: string;
  commit_messages?: string[];
  code?: string;
};

export function ReportSheet({
  state,
  onClose,
}: {
  state: ReportState | null;
  onClose: () => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const open = !!state;
  const name = state ? splitPath(state.file.path).name : "";

  async function copyReport() {
    if (!state?.report) return;
    try {
      await navigator.clipboard.writeText(state.report);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full max-w-xl overflow-y-auto sm:max-w-xl">
        {state && (
          <div className="flex flex-col gap-5 pr-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-excav-lilac">
                <Sparkles className="h-3.5 w-3.5" />
                Archaeology Report
              </div>
              <h2 className="mt-1 break-all font-mono text-base text-slate-100">
                {name}
              </h2>
              <p className="mt-0.5 break-all text-[11px] text-slate-500">
                {state.file.path}
              </p>
            </div>

            {state.loading && (
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-4 text-sm text-slate-300 ring-1 ring-white/10">
                <Loader2 className="h-4 w-4 animate-spin text-excav-lilac" />
                Reading the dig site…
              </div>
            )}

            {state.error && (
              <div className="flex items-start gap-3 rounded-xl bg-rose-500/10 p-4 text-sm text-rose-200 ring-1 ring-rose-400/30">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{state.error}</span>
              </div>
            )}

            {state.report && (
              <div className="rounded-xl border border-excav-violet/20 bg-excav-violet/[0.06] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-excav-lilac">
                    Summary
                  </span>
                  <Button variant="ghost" size="sm" onClick={copyReport}>
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" /> Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                  {state.report.replace(/\*\*/g, "")}
                </p>
              </div>
            )}

            {state.commit_messages && state.commit_messages.length > 0 && (
              <div>
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Recent commits
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {state.commit_messages.map((m, i) => (
                    <li
                      key={i}
                      className="rounded-lg bg-black/30 px-3 py-2 font-mono text-xs text-slate-300 ring-1 ring-white/5"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {state.code && (
              <div>
                <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Source preview
                </h3>
                <pre className="max-h-72 overflow-auto rounded-xl bg-[#0a0712] p-4 font-mono text-xs leading-relaxed text-slate-300 ring-1 ring-white/10">
                  {state.code}
                </pre>
              </div>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
