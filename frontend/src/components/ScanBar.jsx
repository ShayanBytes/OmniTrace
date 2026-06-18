// ScanBar.jsx
// The primary control strip: enter a local repo path, scan it, and reach
// the AI provider settings. Also shows a live backend health dot and a
// compact summary of which AI provider/model is currently selected.
import { motion } from "framer-motion";
import { PROVIDERS } from "../providers.js";

export default function ScanBar({
  repoPath,
  setRepoPath,
  onScan,
  scanning,
  backendUp,
  settings,
  onOpenSettings,
}) {
  const provider = PROVIDERS[settings.provider];

  function handleKeyDown(e) {
    if (e.key === "Enter" && repoPath.trim() && !scanning) onScan();
  }

  return (
    <div className="glass rounded-2xl p-3 sm:p-4 shadow-glow">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Repo path input */}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-violet-300/70">
            {/* folder glyph */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
          </span>
          <input
            value={repoPath}
            onChange={(e) => setRepoPath(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste a local git repo path…  e.g.  C:\\Users\\you\\projects\\my-app"
            className="w-full rounded-xl bg-black/40 py-3 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-violet-400/70"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Provider chip → opens settings */}
          <button
            onClick={onOpenSettings}
            className="group flex items-center gap-2 rounded-xl bg-black/40 px-3 py-3 text-left text-xs ring-1 ring-white/10 transition hover:ring-violet-400/60"
            title="AI provider settings"
          >
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/20 text-violet-200">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block font-semibold text-slate-200">
                {provider?.label || settings.provider}
              </span>
              <span className="block max-w-[10rem] truncate text-[11px] text-slate-400">
                {settings.model || "choose a model"}
              </span>
            </span>
          </button>

          {/* Scan button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onScan}
            disabled={scanning || !repoPath.trim()}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10">
              {scanning ? "Excavating…" : "Excavate"}
            </span>
            {scanning && (
              <span className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Status row */}
      <div className="mt-2 flex items-center gap-2 px-1 text-[11px] text-slate-400">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            backendUp ? "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" : "bg-rose-500"
          }`}
        />
        {backendUp ? "Backend connected" : "Backend offline — start the API on :8000"}
      </div>
    </div>
  );
}
