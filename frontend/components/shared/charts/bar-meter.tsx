"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export type BarDatum = {
  label: string;
  value: number;
  /** Tailwind bg-* class (and matching text color is derived by caller). */
  color?: string;
  hint?: string;
};

type BarMeterProps = {
  data: BarDatum[];
  className?: string;
  /** Show the numeric value at the end of each row. */
  showValues?: boolean;
  /** Override the max; defaults to the largest value in `data`. */
  max?: number;
};

/**
 * Horizontal bars that grow from 0 → their value when scrolled into view, with
 * a soft sheen sweep. A count-up runs alongside the width animation. Under
 * reduced-motion the bars render at full width immediately.
 */
export function BarMeter({
  data,
  className,
  showValues = true,
  max,
}: BarMeterProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const peak = max ?? Math.max(1, ...data.map((d) => d.value));
  const armed = reduce || inView;

  return (
    <div ref={ref} className={cn("flex flex-col gap-2.5", className)}>
      {data.map((d, i) => {
        const pct = Math.max(2, Math.round((d.value / peak) * 100));
        return (
          <div key={d.label} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between text-[11px]">
              <span className="text-slate-400">{d.label}</span>
              {showValues && (
                <span className="font-mono text-slate-300">
                  {d.value.toLocaleString("en-US")}
                  {d.hint ? <span className="ml-1 text-slate-500">{d.hint}</span> : null}
                </span>
              )}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.05] ring-1 ring-white/5">
              <motion.div
                className={cn(
                  "relative h-full rounded-full",
                  d.color ?? "bg-excav-violet"
                )}
                initial={false}
                animate={{ width: armed ? `${pct}%` : "0%" }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }
                }
              >
                {!reduce && (
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
