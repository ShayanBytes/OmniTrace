"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Animated "keep scrolling" hint: a label over a mouse-shaped capsule with a
 * dot that drifts down on a loop, plus a bobbing chevron. Reduced-motion shows
 * a static version.
 */
export function ScrollCue({ className }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cn(
        "pointer-events-none flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-slate-600",
        className
      )}
    >
      <span>scroll to dig</span>
      <span className="relative flex h-7 w-[18px] justify-center rounded-full border border-slate-600/70">
        <motion.span
          className="mt-1.5 h-1.5 w-1 rounded-full bg-excav-cyan"
          animate={reduce ? undefined : { y: [0, 8, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
      <motion.span
        animate={reduce ? undefined : { y: [0, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-3.5 w-3.5 text-slate-600" />
      </motion.span>
    </div>
  );
}
