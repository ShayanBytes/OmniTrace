// ReportModal.jsx
// Shows the AI "Archaeology Report" for one excavated file: the generated
// explanation, the recent commit history that fed the prompt, and a
// collapsible view of the raw source code.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { splitPath } from "../utils.js";

export default function ReportModal({ open, state, onClose }) {
  const [showCode, setShowCode] = useState(false);

  // `state` = { file, loading, error, report, commit_messages, code }
  const file = state?.file;
  const { name } = file ? splitPath(file.path) : { name: "" };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="glass relative my-8 w-full max-w-2xl rounded-3xl p-6 shadow-glow"
          >
            {/* Header */}
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-violet-300">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 3 8 21M16 3l-3 18M3 8h18M3 16h18" />
                  </svg>
                  Archaeology report
                </div>
                <h2 className="truncate text-lg font-bold text-slate-100" title={file?.path}>
                  {name}
                </h2>
                <p className="truncate text-[11px] text-slate-500">{file?.path}</p>
              </div>
              <button
                onClick={onClose}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            {state?.loading && <LoadingReport />}

            {!state?.loading && state?.error && (
              <div className="rounded-xl bg-rose-500/10 p-4 text-sm text-rose-200 ring-1 ring-rose-400/30">
                {state.error}
              </div>
            )}

            {!state?.loading && !state?.error && (
              <div className="space-y-4">
                {/* The generated explanation */}
                <div className="rounded-2xl bg-black/35 p-4 ring-1 ring-violet-400/20">
                  <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-100">
                    {state?.report}
                  </p>
                </div>

                {/* Commit history that fed the prompt */}
                {state?.commit_messages?.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Recent commits
                    </h3>
                    <ol className="space-y-1.5">
                      {state.commit_messages.map((msg, i) => (
                        <li
                          key={i}
                          className="flex gap-2 rounded-lg bg-black/30 px-3 py-2 text-xs text-slate-300 ring-1 ring-white/5"
                        >
                          <span className="text-violet-300">#{i + 1}</span>
                          <span className="min-w-0 flex-1 truncate" title={msg}>
                            {msg}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Collapsible raw source */}
                {state?.code && (
                  <div>
                    <button
                      onClick={() => setShowCode((s) => !s)}
                      className="flex w-full items-center justify-between rounded-lg bg-black/30 px-3 py-2 text-xs font-semibold text-slate-300 ring-1 ring-white/10 transition hover:bg-white/5"
                    >
                      <span>{showCode ? "Hide" : "Show"} source code</span>
                      <span className={`transition ${showCode ? "rotate-180" : ""}`}>▾</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {showCode && (
                        <motion.pre
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 max-h-80 overflow-auto rounded-xl bg-black/60 p-4 text-[11px] leading-relaxed text-slate-300 ring-1 ring-white/10"
                        >
                          <code>{state.code}</code>
                        </motion.pre>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Animated skeleton while we wait for the (sometimes slow) AI response.
function LoadingReport() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-violet-200">
        <span className="h-2 w-2 animate-ping rounded-full bg-violet-400" />
        Brushing the dust off… asking the AI to interpret this artifact.
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-lg bg-white/5"
          style={{ height: 14, width: `${90 - i * 12}%` }}
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shimmer" />
        </div>
      ))}
    </div>
  );
}
