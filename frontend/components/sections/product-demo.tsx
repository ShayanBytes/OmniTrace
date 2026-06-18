"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Play, RotateCcw, Loader2, Sparkles } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { GlowOrb } from "@/components/shared/glow-orb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeWindow } from "@/components/shared/code-window";
import { RiskBadge } from "@/components/shared/risk-badge";
import { DEMO_PHASES } from "@/lib/demo-script";
import { DEMO_GRAVEYARD, demoReport } from "@/lib/mock-data";
import { riskLevel, splitPath } from "@/lib/risk";
import { cn } from "@/lib/utils";

const TARGET = DEMO_GRAVEYARD[0];
const REPORT = demoReport(TARGET);

// Phase order: idle → scanning → graveyard → analyzing → report
const STEPS = DEMO_PHASES;

export function ProductDemo() {
  const reduce = useReducedMotion();
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const phase = STEPS[step];

  // Auto-advance through the script while "playing".
  React.useEffect(() => {
    if (!playing) return;
    if (step >= STEPS.length - 1) {
      setPlaying(false);
      return;
    }
    const dwell = reduce ? 600 : phase.id === "scanning" || phase.id === "analyzing" ? 1900 : 1400;
    const t = setTimeout(() => setStep((s) => s + 1), dwell);
    return () => clearTimeout(t);
  }, [playing, step, phase.id, reduce]);

  const start = () => {
    setStep(0);
    setPlaying(true);
  };
  const replay = () => {
    setStep(0);
    setPlaying(true);
  };

  const showGraveyard = step >= 2;
  const showReport = step >= 4;

  return (
    <SectionShell
      id="demo"
      backdrop={<GlowOrb className="left-1/3 top-0 h-[30rem] w-[30rem]" color="bg-excav-violetDeep/25" animate="drift" />}
    >
      <SectionHeading
        eyebrow="Interactive Demo"
        title="Watch OmniTrace work"
        description="A simulated end-to-end run: scan a repository, surface its riskiest files, and generate an AI archaeology report — all without leaving the page."
      />

      <div className="mx-auto mt-10 max-w-4xl">
        <CodeWindow
          title="omnitrace — acme/payments-core"
          toolbar={
            <Badge variant="default" className="font-mono text-[10px]">
              simulated
            </Badge>
          }
        >
          {/* Command line + status */}
          <div className="font-mono text-sm">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">$</span>
              <span className="text-slate-200">{phase.command}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              {(phase.id === "scanning" || phase.id === "analyzing") && (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-excav-lilac" />
              )}
              <span>{phase.status}</span>
            </div>
          </div>

          {/* Stat strip after scan */}
          <AnimatePresence>
            {showGraveyard && (
              <motion.div
                initial={reduce ? false : { opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 grid grid-cols-4 gap-2 overflow-hidden"
              >
                {[
                  ["14,238", "commits"],
                  ["2,167", "files"],
                  ["63", "authors"],
                  ["12", "abandoned"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-lg bg-white/[0.03] p-2.5 text-center ring-1 ring-white/5">
                    <div className="font-display text-base text-slate-100">{v}</div>
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">{l}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Graveyard table */}
          <AnimatePresence>
            {showGraveyard && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 overflow-hidden rounded-xl ring-1 ring-white/10"
              >
                {DEMO_GRAVEYARD.slice(0, 4).map((f, i) => {
                  const isTarget = f.path === TARGET.path;
                  const { name } = splitPath(f.path);
                  const risk = riskLevel(f);
                  return (
                    <div
                      key={f.path}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 text-xs transition-colors",
                        i !== 3 && "border-b border-white/5",
                        isTarget && step >= 3
                          ? "bg-excav-violet/15"
                          : "bg-black/20"
                      )}
                    >
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", risk.dot)} />
                      <span className="flex-1 truncate font-mono text-slate-200">{name}</span>
                      <span className="hidden text-slate-500 sm:inline">{f.days_idle}d idle</span>
                      <RiskBadge file={f} />
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI report */}
          <AnimatePresence>
            {showReport && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-excav-violet/20 bg-excav-violet/[0.06] p-4"
              >
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-excav-lilac">
                  <Sparkles className="h-3.5 w-3.5" />
                  Archaeology Report · {splitPath(TARGET.path).name}
                </div>
                <p className="text-xs leading-relaxed text-slate-300">
                  {REPORT.report.replace(/\*\*/g, "")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex gap-1.5">
              {STEPS.map((s, i) => (
                <span
                  key={s.id}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i <= step ? "w-6 bg-excav-violet" : "w-1.5 bg-white/15"
                  )}
                />
              ))}
            </div>
            {step === 0 && !playing ? (
              <Button onClick={start} variant="gradient" size="sm">
                <Play className="h-4 w-4" />
                Run demo
              </Button>
            ) : step >= STEPS.length - 1 ? (
              <Button onClick={replay} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4" />
                Replay
              </Button>
            ) : (
              <span className="font-mono text-xs text-slate-500">running…</span>
            )}
          </div>
        </CodeWindow>
      </div>
    </SectionShell>
  );
}
