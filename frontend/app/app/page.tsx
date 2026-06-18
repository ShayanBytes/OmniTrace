"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

import { ScanBar } from "@/components/app/scan-bar";
import { OverviewStats } from "@/components/app/overview-stats";
import {
  GraveyardToolbar,
  type RiskFilter,
  type SortKey,
} from "@/components/app/graveyard-toolbar";
import { FileCard } from "@/components/shared/file-card";
import { SettingsDialog } from "@/components/app/settings-dialog";
import { ReportSheet, type ReportState } from "@/components/app/report-sheet";
import { Toasts, useToasts } from "@/components/app/toasts";
import { Button } from "@/components/ui/button";

import { analyzeFile, checkHealth, scanRepo } from "@/lib/api";
import { loadSettings, saveSettings, type Settings } from "@/lib/providers";
import {
  loadRecentRepos,
  pushRecentRepo,
  removeRecentRepo,
} from "@/lib/storage";
import { riskLevel, riskScore } from "@/lib/risk";
import { cn } from "@/lib/utils";
import type { GraveyardFile, RepoOverview } from "@/lib/mock-data";

export default function ConsolePage() {
  const { toasts, addToast, dismiss } = useToasts();

  // Settings (persisted) — load after mount to stay SSR-safe.
  const [settings, setSettings] = React.useState<Settings>(() => loadSettings());
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  React.useEffect(() => setSettings(loadSettings()), []);

  // Scan state
  const [repoPath, setRepoPath] = React.useState("");
  const [topN, setTopN] = React.useState(12);
  const [scanning, setScanning] = React.useState(false);
  const [scanError, setScanError] = React.useState("");
  const [overview, setOverview] = React.useState<RepoOverview | null>(null);
  const [graveyard, setGraveyard] = React.useState<GraveyardFile[]>([]);
  const [recents, setRecents] = React.useState<string[]>([]);
  React.useEffect(() => setRecents(loadRecentRepos()), []);

  // Grid controls
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("idle");
  const [risk, setRisk] = React.useState<RiskFilter>("all");
  const searchRef = React.useRef<HTMLInputElement>(null);

  // Report
  const [report, setReport] = React.useState<ReportState | null>(null);
  const [analyzingPath, setAnalyzingPath] = React.useState<string | null>(null);

  // Backend health
  const [backendUp, setBackendUp] = React.useState(false);
  React.useEffect(() => {
    let alive = true;
    const ping = async () => {
      const up = await checkHealth();
      if (alive) setBackendUp(up);
    };
    ping();
    const id = setInterval(ping, 8000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  // Keyboard: "/" focuses filter, Esc closes overlays.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = document.activeElement?.tagName;
      if (
        e.key === "/" &&
        graveyard.length > 0 &&
        tag !== "INPUT" &&
        tag !== "SELECT" &&
        tag !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        if (report) setReport(null);
        else if (settingsOpen) setSettingsOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [graveyard.length, report, settingsOpen]);

  function persistSettings(next: Settings) {
    setSettings(next);
    saveSettings(next);
    setSettingsOpen(false);
    addToast(`AI provider set to ${next.provider}`, "success");
  }

  async function handleScan(path = repoPath) {
    const target = (path || "").trim();
    if (!target) return;
    setScanning(true);
    setScanError("");
    setOverview(null);
    setGraveyard([]);
    setSearch("");
    setRisk("all");
    try {
      const data = await scanRepo(target, topN);
      if (!data.ok) {
        setScanError(data.error || "Scan failed.");
        addToast("Scan failed", "error");
      } else {
        setOverview(data.overview);
        setGraveyard(data.graveyard || []);
        setRecents(pushRecentRepo(target));
        addToast(`Traced ${data.graveyard?.length || 0} abandoned files`, "success");
      }
    } catch {
      setScanError(
        "Could not reach the backend. Make sure the API is running on port 8000."
      );
      addToast("Backend unreachable", "error");
    } finally {
      setScanning(false);
    }
  }

  async function handleAnalyze(file: GraveyardFile) {
    setAnalyzingPath(file.path);
    setReport({ file, loading: true });
    try {
      const data = await analyzeFile(repoPath.trim(), file.path, settings);
      if (!data.ok) {
        setReport({ file, loading: false, error: data.error });
      } else {
        setReport({
          file,
          loading: false,
          report: data.report,
          commit_messages: data.commit_messages,
          code: data.code,
        });
      }
    } catch {
      setReport({
        file,
        loading: false,
        error: "Request failed — is the backend running?",
      });
    } finally {
      setAnalyzingPath(null);
    }
  }

  const counts = React.useMemo(() => {
    const c = { high: 0, medium: 0, low: 0 };
    graveyard.forEach((f) => {
      c[riskLevel(f).key] += 1;
    });
    return c;
  }, [graveyard]);

  const displayed = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = graveyard.filter((f) => {
      if (risk !== "all" && riskLevel(f).key !== risk) return false;
      if (q && !f.path.toLowerCase().includes(q)) return false;
      return true;
    });
    const by: Record<SortKey, (a: GraveyardFile, b: GraveyardFile) => number> = {
      idle: (a, b) => b.days_idle - a.days_idle,
      risk: (a, b) => riskScore(b) - riskScore(a),
      complexity: (a, b) => (b.max_complexity || 0) - (a.max_complexity || 0),
      name: (a, b) => a.path.localeCompare(b.path),
    };
    return [...list].sort(by[sort]);
  }, [graveyard, search, risk, sort]);

  const hasResults = overview || graveyard.length > 0;

  return (
    <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="font-display text-3xl text-gradient">Repository console</h1>
        <p className="mt-1 text-sm text-slate-400">
          Point OmniTrace at a local git repo to surface its riskiest, most
          forgotten files — then let AI explain them.
        </p>
      </motion.div>

      <ScanBar
        repoPath={repoPath}
        setRepoPath={setRepoPath}
        onScan={() => handleScan()}
        scanning={scanning}
        backendUp={backendUp}
        settings={settings}
        onOpenSettings={() => setSettingsOpen(true)}
        topN={topN}
        setTopN={setTopN}
      />

      {/* Recent repos */}
      {recents.length > 0 && !hasResults && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] uppercase tracking-wide text-slate-500">
            Recent
          </span>
          {recents.map((p) => (
            <span
              key={p}
              className="group flex items-center gap-1 rounded-full bg-white/5 py-1 pl-3 pr-1 text-xs text-slate-300 ring-1 ring-white/10"
            >
              <button
                onClick={() => {
                  setRepoPath(p);
                  handleScan(p);
                }}
                className="max-w-[16rem] truncate transition hover:text-white"
                title={p}
              >
                {p}
              </button>
              <button
                onClick={() => setRecents(removeRecentRepo(p))}
                className="grid h-4 w-4 place-items-center rounded-full text-slate-500 transition hover:bg-white/10 hover:text-white"
                title="Remove"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Scan error */}
      <AnimatePresence>
        {scanError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200 ring-1 ring-rose-400/30"
          >
            {scanError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {hasResults && (
        <div className="mt-6 space-y-6">
          {overview && <OverviewStats overview={overview} />}

          {graveyard.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                  The graveyard
                </h2>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-400 ring-1 ring-white/10">
                  {graveyard.length} most abandoned files
                </span>
              </div>

              <GraveyardToolbar
                searchRef={searchRef}
                search={search}
                setSearch={setSearch}
                sort={sort}
                setSort={setSort}
                risk={risk}
                setRisk={setRisk}
                counts={counts}
                shown={displayed.length}
                total={graveyard.length}
              />

              {displayed.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {displayed.map((file, i) => (
                    <motion.button
                      key={file.path}
                      layout
                      initial={{ opacity: 0, y: 16, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: Math.min(i * 0.04, 0.4),
                        type: "spring",
                        stiffness: 300,
                        damping: 26,
                      }}
                      whileHover={{ y: -5 }}
                      onClick={() => !analyzingPath && handleAnalyze(file)}
                      disabled={!!analyzingPath}
                      className="group relative block text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-excav-violet/70 disabled:opacity-60"
                    >
                      <FileCard file={file} />
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 rounded-b-2xl bg-gradient-to-t from-excav-violet/30 to-transparent py-2 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <Sparkles className={cn("h-3 w-3", analyzingPath === file.path && "animate-spin")} />
                        {analyzingPath === file.path ? "Analyzing…" : "Analyze with AI"}
                      </span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-black/30 p-8 text-center text-sm text-slate-400 ring-1 ring-white/10">
                  No files match your filters.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!hasResults && !scanning && (
        <motion.div
          className="mt-16 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-excav-violet to-excav-violetDeep shadow-glow ring-1 ring-white/15"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-7 w-7 text-white" />
          </motion.div>
          <h2 className="mt-6 max-w-xl font-display text-2xl text-slate-100">
            Every repo has buried history.
          </h2>
          <p className="mt-3 max-w-md text-sm text-slate-400">
            Paste a local git repository path above and hit Trace. OmniTrace
            surfaces the files no one has touched in ages — ranked by risk — then
            any AI model you configure explains what each one was for.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setSettingsOpen(true)}
          >
            Configure AI model &amp; key
          </Button>
        </motion.div>
      )}

      <SettingsDialog
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={persistSettings}
      />
      <ReportSheet state={report} onClose={() => setReport(null)} />
      <Toasts toasts={toasts} onDismiss={dismiss} />
    </main>
  );
}
