import { cn } from "@/lib/utils";

type Variant = "constellation" | "graph" | "strata";

/**
 * 2D poster shown while an R3F scene's chunk loads, and rendered permanently
 * under prefers-reduced-motion (the heavy three chunk is never imported then).
 * Pure SVG/CSS — no WebGL, SSR-safe, deterministic (no hydration mismatch).
 */
export function SceneFallback({
  variant = "constellation",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-3xl",
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(140,69,255,0.22),transparent_70%)]" />
      {variant === "constellation" && <Constellation />}
      {variant === "graph" && <Graph />}
      {variant === "strata" && <Strata />}
    </div>
  );
}

function Constellation() {
  const nodes = [
    [80, 90], [200, 60], [320, 130], [140, 200], [260, 240],
    [380, 200], [120, 300], [300, 330], [420, 300], [220, 140],
  ];
  return (
    <svg viewBox="0 0 480 380" className="absolute inset-0 h-full w-full">
      <g stroke="rgba(140,69,255,0.35)" strokeWidth="1">
        {nodes.slice(0, -1).map((n, i) => (
          <line key={i} x1={n[0]} y1={n[1]} x2={nodes[i + 1][0]} y2={nodes[i + 1][1]} />
        ))}
      </g>
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n[0]}
          cy={n[1]}
          r={i % 3 === 0 ? 5 : 3}
          fill={i % 3 === 0 ? "#b372cf" : "#8c45ff"}
          className="animate-float"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </svg>
  );
}

function Graph() {
  return (
    <svg viewBox="0 0 480 380" className="absolute inset-0 h-full w-full">
      <defs>
        <radialGradient id="gnode" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#43e7ff" />
          <stop offset="100%" stopColor="#1f8aa3" />
        </radialGradient>
      </defs>
      <g stroke="rgba(67,231,255,0.25)" strokeWidth="1">
        <line x1="240" y1="190" x2="120" y2="100" />
        <line x1="240" y1="190" x2="360" y2="110" />
        <line x1="240" y1="190" x2="150" y2="290" />
        <line x1="240" y1="190" x2="350" y2="280" />
        <line x1="120" y1="100" x2="60" y2="60" />
        <line x1="360" y1="110" x2="420" y2="60" />
      </g>
      {[[240, 190, 14], [120, 100, 8], [360, 110, 8], [150, 290, 8], [350, 280, 8], [60, 60, 5], [420, 60, 5]].map(
        ([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="url(#gnode)" />
        )
      )}
    </svg>
  );
}

function Strata() {
  return (
    <svg viewBox="0 0 480 380" className="absolute inset-0 h-full w-full">
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${60 + i * 10}, ${70 + i * 70})`}>
          <rect
            width="320"
            height="46"
            rx="8"
            fill={`rgba(140,69,255,${0.18 - i * 0.03})`}
            stroke="rgba(255,255,255,0.08)"
          />
        </g>
      ))}
    </svg>
  );
}
