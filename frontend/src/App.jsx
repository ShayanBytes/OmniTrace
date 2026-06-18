// App.jsx
// Top-level composition for Code Archaeologist:
//   1. enter a local git repo path and "Excavate" it
//   2. see an overview + a masonry grid of the most abandoned files
//   3. click any "artifact" to get an AI archaeology report, using whatever
//      AI provider / model / key the user configured in Settings
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Background from "./components/Background.jsx";
import ScanBar from "./components/ScanBar.jsx";
import OverviewStats from "./components/OverviewStats.jsx";
import Masonry from "./components/Masonry.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import ReportModal from "./components/ReportModal.jsx";

import { analyzeFile, checkHealth, scanRepo } from "./api.js";
import { loadSettings, saveSettings } from "./providers.js";

export default function App() {
  // ----- AI provider settings (persisted) -----------------------------
  const [settings, setSettings] = useState(loadSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // ----- scan state ----------------------------------------------------
  const [repoPath, setRepoPath] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [overview, setOverview] = useState(null);
  const [graveyard, setGraveyard] = useState([]);

  // ----- analysis (report) state --------------------------------------
  const [report, setReport] = useState(null); // { file, loading, error, ... }
  const [analyzingPath, setAnalyzingPath] = useState(null);

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

  function persistSettings(next) {
    setSettings(next);
    saveSettings(next);
    setSettingsOpen(false);
  }

  async function handleScan() {
    if (!repoPath.trim()) return;
    setScanning(true);
    setScanError("");
    setOverview(null);
    setGraveyard([]);
    try {
      const data = await scanRepo(repoPath.trim(), 12);
      if (!data.ok) {
        setScanError(data.error || "Scan failed.");
      } else {
        setOverview(data.overview);
        setGraveyard(data.graveyard || []);
      }
    } catch {
      setScanError(
        "Could not reach the backend. Make sure the API is running on port 8000."
      );
    } finally {
      setScanning(false);
    }
  }

  async function handleAnalyze(file) {
    // Guard: cloud providers need a key before we even call the server.
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
                <path d="M14.5 12.5 6.6 20.4a1 1 0 1 1-3-3l7.9-7.9" />
                <path d="M15.7 4.3A12.5 12.5 0 0 0 5.5 3a1 1 0 0 0-.3 1.5 12.5 12.5 0 0 1 4.3 8l5.2-8.2z" />
                <path d="M18.3 15.7A12.5 12.5 0 0 0 19.7 5.5 1 1 0 0 0 18.1 5.3 12.5 12.5 0 0 1 10.1 9.5l8.2 6.2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-gradient sm:text-2xl">
                Code Archaeologist
              </h1>
              <p className="text-[11px] text-slate-400 sm:text-xs">
                Dig up the forgotten, risky corners of any git repo.
              </p>
            </div>
          </div>
        </header>

        {/* ---- Scan / settings bar ---- */}
        <ScanBar
          repoPath={repoPath}
          setRepoPath={setRepoPath}
          onScan={handleScan}
          scanning={scanning}
          backendUp={backendUp}
          settings={settings}
          onOpenSettings={() => setSettingsOpen(true)}
        />

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
                <Masonry
                  files={graveyard}
                  onAnalyze={handleAnalyze}
                  analyzingPath={analyzingPath}
                />
              </div>
            )}
          </div>
        )}

        {/* ---- Empty state ---- */}
        {!hasResults && !scanning && (
          <EmptyState onOpenSettings={() => setSettingsOpen(true)} />
        )}
      </div>

      {/* ---- Modals ---- */}
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
      />
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
      <div className="animate-float text-6xl">🏺</div>
      <h2 className="mt-6 max-w-xl text-2xl font-bold text-slate-100">
        Every repo has buried history.
      </h2>
      <p className="mt-3 max-w-md text-sm text-slate-400">
        Point Code Archaeologist at a local git repository and it surfaces the
        files no one has touched in ages — ranked by how risky they are to
        revive. Then let any AI model you like explain what each one was for.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
        <Step n="1" text="Paste a repo path above" />
        <Step n="2" text="Hit Excavate" />
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
