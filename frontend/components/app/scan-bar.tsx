"use client";

import { motion } from "framer-motion";
import { FolderGit2, Settings2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PROVIDERS, type Settings } from "@/lib/providers";

export function ScanBar({
  repoPath,
  setRepoPath,
  onScan,
  scanning,
  backendUp,
  settings,
  onOpenSettings,
  topN,
  setTopN,
}: {
  repoPath: string;
  setRepoPath: (v: string) => void;
  onScan: () => void;
  scanning: boolean;
  backendUp: boolean;
  settings: Settings;
  onOpenSettings: () => void;
  topN: number;
  setTopN: (n: number) => void;
}) {
  const provider = PROVIDERS[settings.provider];

  return (
    <div className="glass rounded-2xl p-3 shadow-glow sm:p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <FolderGit2 className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-excav-lilac/70" />
          <input
            value={repoPath}
            onChange={(e) => setRepoPath(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && repoPath.trim() && !scanning) onScan();
            }}
            placeholder="Paste a local git repo path…  e.g.  C:\\Users\\you\\projects\\my-app"
            className="w-full rounded-xl bg-black/40 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-excav-violet/70"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={topN}
            onChange={(e) => setTopN(Number(e.target.value))}
            title="How many abandoned files to surface"
            className="rounded-xl bg-black/40 px-2.5 py-3 text-xs text-slate-200 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-excav-violet/70"
          >
            {[8, 12, 20, 30, 50].map((n) => (
              <option key={n} value={n} className="bg-excav-panel">
                Top {n}
              </option>
            ))}
          </select>

          <button
            onClick={onOpenSettings}
            className="group flex items-center gap-2 rounded-xl bg-black/40 px-3 py-3 text-left text-xs ring-1 ring-white/10 transition hover:ring-excav-violet/60"
            title="AI provider settings"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-excav-violet/20 text-excav-lilac">
              <Settings2 className="h-[15px] w-[15px]" />
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-semibold text-slate-200">
                {provider.label}
              </span>
              <span className="block max-w-[10rem] truncate text-[11px] text-slate-400">
                {settings.model || "choose a model"}
              </span>
            </span>
          </button>

          <motion.div whileTap={{ scale: 0.96 }}>
            <Button
              variant="gradient"
              size="lg"
              onClick={onScan}
              disabled={scanning || !repoPath.trim()}
            >
              {scanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Tracing…
                </>
              ) : (
                "Trace"
              )}
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 px-1 text-[11px] text-slate-400">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            backendUp
              ? "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]"
              : "bg-rose-500"
          }`}
        />
        {backendUp
          ? "Backend connected"
          : "Backend offline — start the API on :8000"}
      </div>
    </div>
  );
}
