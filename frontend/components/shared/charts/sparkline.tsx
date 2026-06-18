"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { drawLine } from "@/lib/motion";

type SparklineProps = {
  /** Series of values; normalized to the box automatically. */
  data: number[];
  className?: string;
  width?: number;
  height?: number;
  stroke?: string;
  /** Fill the area under the line with a faint gradient. */
  fill?: boolean;
};

/**
 * A small trend line that "draws" itself left-to-right on view (animated
 * pathLength), with a glowing dot riding the end. Under reduced-motion the full
 * line is shown immediately. Pure SVG — no dependencies.
 */
export function Sparkline({
  data,
  className,
  width = 160,
  height = 44,
  stroke = "#43e7ff",
  fill = true,
}: SparklineProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const armed = reduce || inView;

  const pad = 3;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const stepX = (width - pad * 2) / Math.max(1, data.length - 1);

  const pts = data.map((v, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return [x, y] as const;
  });

  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${d} L${pts[pts.length - 1][0].toFixed(1)},${height - pad} L${pts[0][0].toFixed(1)},${height - pad} Z`;
  const [ex, ey] = pts[pts.length - 1];
  const gid = React.useId();

  return (
    <div ref={ref} className={cn("inline-block", className)}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        <defs>
          <linearGradient id={`spk-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {fill && (
          <motion.path
            d={area}
            fill={`url(#spk-${gid})`}
            initial={false}
            animate={{ opacity: armed ? 1 : 0 }}
            transition={{ duration: 0.6, delay: reduce ? 0 : 0.5 }}
          />
        )}
        <motion.path
          d={d}
          stroke={stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={drawLine}
          initial={false}
          animate={armed ? "show" : "hidden"}
          transition={reduce ? { duration: 0 } : undefined}
        />
        <motion.circle
          cx={ex}
          cy={ey}
          r={3}
          fill={stroke}
          initial={false}
          animate={{ opacity: armed ? 1 : 0, scale: armed ? 1 : 0 }}
          transition={{ delay: reduce ? 0 : 1.0, type: "spring", stiffness: 400, damping: 18 }}
          style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
        />
      </svg>
    </div>
  );
}
