// App.jsx
// Top-level composition for OmniTrace:
//   1. enter a local git repo path and "Trace" it
//   2. see an overview + a masonry grid of the most abandoned files,
//      with live search / sort / risk filtering
//   3. click any "artifact" to get an AI report, using whatever AI
//      provider / model / key the user configured in Settings
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Background from "./components/Background.jsx";
import ScanBar from "./components/ScanBar.jsx";
import OverviewStats from "./components/OverviewStats.jsx";
import Masonry from "./components/Masonry.jsx";
import GraveyardToolbar from "./components/GraveyardToolbar.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import ReportModal from "./components/ReportModal.jsx";
import Toasts from "./components/Toasts.jsx";

import { analyzeFile, checkHealth, scanRepo } from "./api.js";
import { loadSettings, saveSettings } from "./providers.js";
import { loadRecentRepos, pushRecentRepo, removeRecentRepo } from "./storage.js";
import { riskLevel, riskScore } from "./utils.js";

export default function App() {
  // ----- AI provider settings (persisted) -----------------------------
  const [settings, setSettings] = useState(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // ----- scan state ----------------------------------------------------
  const [repoPath, setRepoPath] = useState("");
  const [topN, setTopN] = useState(12);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [overview, setOverview] = useState(null);
  const [graveyard, setGraveyard] = useState([]);
  const [recents, setRecents] = useState(loadRecentRepos);

  // ----- grid controls -------------------------------------------------
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("idle");
  const [risk, setRisk] = useState("all");
  const searchRef = useRef(null);

  // ----- analysis (report) state --------------------------------------
  const [report, setReport] = useState(null); // { file, loading, error, ... }
  const [analyzingPath, setAnalyzingPath] = useState(null);

  // ----- toasts --------------------------------------------------------
  const [toasts, setToasts] = useState([]);
  const toastSeq = useRef(0);
  function addToast(message, tone = "info") {
    const id = ++toastSeq.current;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }
  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  // ----- backend health dot -------------------------------------------
  const [backendUp, setBackendUp] = useState(false);
  useEffect(() => {
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

  // ----- keyboard shortcuts -------------------------------------------
  useEffect(() => {
    function onKey(e) {
      // "/" focuses the grid filter (unless already typing in a field)
      if (
        e.key === "/" &&
        graveyard.length > 0 &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "SELECT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      // Esc closes whichever modal is open
      if (e.key === "Escape") {
        if (report) setReport(null);
        else if (settingsOpen) setSettingsOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [graveyard.length, report, settingsOpen]);

  function persistSettings(next) {
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
        addToast(
          `Traced ${data.graveyard?.length || 0} abandoned files`,
          "success"
        );
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

  function dropRecent(path) {
    setRecents(removeRecentRepo(path));
  }

  async function handleAnalyze(file) {
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

  // ----- derived: counts, filtered + sorted grid ----------------------
  const counts = useMemo(() => {
    const c = { high: 0, medium: 0, low: 0 };
    graveyard.forEach((f) => {
      c[riskLevel(f).key] += 1;
    });
    return c;
  }, [graveyard]);

  const displayed = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = graveyard.filter((f) => {
      if (risk !== "all" && riskLevel(f).key !== risk) return false;
      if (q && !f.path.toLowerCase().includes(q)) return false;
      return true;
    });
    const by = {
      idle: (a, b) => b.days_idle - a.days_idle,
      risk: (a, b) => riskScore(b) - riskScore(a),
      complexity: (a, b) => (b.max_complexity || 0) - (a.max_complexity || 0),
      name: (a, b) => a.path.localeCompare(b.path),
    };
    return [...list].sort(by[sort] || by.idle);
  }, [graveyard, search, risk, sort]);

  const hasResults = overview || graveyard.length > 0;

  return (
    <div className="relative min-h-screen">
      <Background />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6">
        {/* ---- Header / wordmark ---- */}
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-glow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-3.6-3.6" />
                <path d="M11 8v3l2 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-gradient sm:text-2xl">
                OmniTrace
              </h1>
              <p className="text-[11px] text-slate-400 sm:text-xs">
                Trace the forgotten, risky corners of any git repo.
              </p>
            </div>
          </div>
        </header>

        {/* ---- Scan / settings bar ---- */}
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

        {/* ---- Recent repos ---- */}
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
                  onClick={() => dropRecent(p)}
                  className="grid h-4 w-4 place-items-center rounded-full text-slate-500 transition hover:bg-white/10 hover:text-white"
                  title="Remove"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* ---- Scan error ---- */}
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

        {/* ---- Results ---- */}
        {hasResults && (
          <div className="mt-6 space-y-6">
            <OverviewStats overview={overview} />

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
                  ref={searchRef}
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
                  <Masonry
                    files={displayed}
                    onAnalyze={handleAnalyze}
                    analyzingPath={analyzingPath}
                  />
                ) : (
                  <div className="rounded-2xl bg-black/30 p-8 text-center text-sm text-slate-400 ring-1 ring-white/10">
                    No files match your filters.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---- Empty state ---- */}
        {!hasResults && !scanning && (
          <EmptyState onOpenSettings={() => setSettingsOpen(true)} />
        )}
      </div>

      {/* ---- Modals + toasts ---- */}
      <SettingsModal
        open={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onSave={persistSettings}
      />
      <ReportModal
        open={!!report}
        state={report}
        onClose={() => setReport(null)}
        notify={addToast}
      />
      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

// First-run hero shown before any scan.
function EmptyState({ onOpenSettings }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mt-16 flex flex-col items-center text-center"
    >
      <div className="animate-float text-6xl">🛰️</div>
      <h2 className="mt-6 max-w-xl text-2xl font-bold text-slate-100">
        Every repo has buried history.
      </h2>
      <p className="mt-3 max-w-md text-sm text-slate-400">
        Point OmniTrace at a local git repository and it surfaces the files no
        one has touched in ages — ranked by how risky they are to revive. Then
        let any AI model you like explain what each one was for.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
        <Step n="1" text="Paste a repo path above" />
        <Step n="2" text="Hit Trace" />
        <button
          onClick={onOpenSettings}
          className="rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-violet-400/30 transition hover:bg-violet-500/20 hover:text-white"
        >
          ⚙ Configure your AI model & key
        </button>
      </div>
    </motion.div>
  );
}

function Step({ n, text }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
      <span className="grid h-4 w-4 place-items-center rounded-full bg-violet-500/30 text-[10px] text-violet-200">
        {n}
      </span>
      {text}
    </span>
  );
}
