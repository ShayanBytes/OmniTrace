"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export type DonutSegment = {
  label: string;
  value: number;
  /** Stroke color (hex/rgb). */
  color: string;
};

type DonutProps = {
  segments: DonutSegment[];
  className?: string;
  size?: number;
  thickness?: number;
  /** Center label (e.g. total). */
  centerLabel?: React.ReactNode;
  centerSub?: string;
};

/**
 * An animated ring chart: each segment's arc draws in sequentially via
 * stroke-dashoffset when scrolled into view. Reduced-motion shows the full ring
 * immediately. Pure SVG.
 */
export function Donut({
  segments,
  className,
  size = 132,
  thickness = 14,
  centerLabel,
  centerSub,
}: DonutProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const armed = reduce || inView;

  const total = Math.max(1, segments.reduce((s, x) => s + x.value, 0));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;

  let offsetAcc = 0;
  const arcs = segments.map((seg) => {
    const frac = seg.value / total;
    const len = frac * c;
    const arc = { seg, len, rotate: (offsetAcc / c) * 360 };
    offsetAcc += len;
    return arc;
  });

  return (
    <div ref={ref} className={cn("relative inline-grid place-items-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={thickness}
        />
        {arcs.map(({ seg, len, rotate }, i) => (
          <motion.circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={`${len} ${c}`}
            transform={`rotate(${rotate} ${size / 2} ${size / 2})`}
            initial={false}
            animate={{ strokeDashoffset: armed ? 0 : len }}
            transition={reduce ? { duration: 0 } : { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.18 }}
            style={{ filter: `drop-shadow(0 0 3px ${seg.color}66)` }}
          />
        ))}
      </svg>
      {(centerLabel || centerSub) && (
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="font-display text-xl text-slate-100">{centerLabel}</div>
            {centerSub && <div className="text-[10px] uppercase tracking-wide text-slate-500">{centerSub}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
