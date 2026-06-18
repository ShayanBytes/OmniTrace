"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { drawLine } from "@/lib/motion";

/**
 * A lightweight 2D dependency graph rendered in SVG: hub + leaf nodes, edges
 * that "draw" themselves on view, and little data packets that travel along the
 * edges on a loop — the signature "living graph" effect, far cheaper than the
 * 3D scene and always-on. Reduced-motion: edges/nodes static, packets hidden.
 */

const W = 360;
const H = 260;

// Deterministic layout: a central hub, a couple of sub-hubs, and leaves.
type GraphNode = {
  id: string;
  x: number;
  y: number;
  r: number;
  hub?: boolean;
  color: string;
};

const NODES: GraphNode[] = [
  { id: "core", x: 180, y: 130, r: 9, hub: true, color: "#43e7ff" },
  { id: "auth", x: 80, y: 70, r: 7, hub: true, color: "#8c45ff" },
  { id: "api", x: 290, y: 80, r: 7, hub: true, color: "#8c45ff" },
  { id: "ui", x: 300, y: 200, r: 6, color: "#b372cf" },
  { id: "db", x: 70, y: 200, r: 6, color: "#b372cf" },
  { id: "util", x: 180, y: 36, r: 5, color: "#b372cf" },
  { id: "jobs", x: 180, y: 224, r: 5, color: "#b372cf" },
  { id: "cache", x: 40, y: 130, r: 5, color: "#b372cf" },
  { id: "edge", x: 322, y: 140, r: 5, color: "#b372cf" },
];

const node = (id: string) => NODES.find((n) => n.id === id)!;

const EDGES: [string, string, boolean][] = [
  ["core", "auth", false],
  ["core", "api", false],
  ["core", "ui", false],
  ["core", "db", false],
  ["core", "jobs", false],
  ["auth", "cache", false],
  ["auth", "util", false],
  ["api", "util", false],
  ["api", "edge", false],
  ["core", "edge", true], // a "cycle" highlight
];

export function DependencyMinigraph({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const armed = reduce || inView;

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" fill="none">
        {/* Edges (draw in) */}
        {EDGES.map(([a, b, cycle], i) => {
          const na = node(a);
          const nb = node(b);
          return (
            <motion.line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              stroke={cycle ? "#ffb347" : "#8c45ff"}
              strokeWidth={cycle ? 1.6 : 1}
              strokeOpacity={cycle ? 0.7 : 0.4}
              strokeDasharray={cycle ? "4 4" : undefined}
              variants={drawLine}
              initial={false}
              animate={armed ? "show" : "hidden"}
              transition={reduce ? { duration: 0 } : { delay: i * 0.08 }}
            />
          );
        })}

        {/* Traveling packets along non-cycle edges */}
        {!reduce &&
          EDGES.filter(([, , c]) => !c).map(([a, b], i) => {
            const na = node(a);
            const nb = node(b);
            return (
              <motion.circle
                key={`pkt-${a}-${b}`}
                r={2.2}
                fill="#43e7ff"
                style={{ filter: "drop-shadow(0 0 3px #43e7ff)" }}
                initial={{ cx: na.x, cy: na.y, opacity: 0 }}
                animate={
                  armed
                    ? { cx: [na.x, nb.x], cy: [na.y, nb.y], opacity: [0, 1, 1, 0] }
                    : { opacity: 0 }
                }
                transition={{
                  duration: 2.2,
                  delay: 1 + (i % 5) * 0.4,
                  repeat: Infinity,
                  repeatDelay: 1.6,
                  ease: "easeInOut",
                }}
              />
            );
          })}

        {/* Nodes (pop in) */}
        {NODES.map((n, i) => (
          <motion.g
            key={n.id}
            initial={false}
            animate={{ scale: armed ? 1 : 0, opacity: armed ? 1 : 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 380, damping: 20, delay: 0.2 + i * 0.05 }
            }
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          >
            {n.hub && (
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r + 4}
                fill="none"
                stroke={n.color}
                strokeOpacity={0.4}
                className={reduce ? undefined : "origin-center animate-pulse-ring"}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r}
              fill={n.color}
              style={{ filter: `drop-shadow(0 0 5px ${n.color}aa)` }}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
