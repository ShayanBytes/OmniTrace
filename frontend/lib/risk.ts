import type { GraveyardFile, RiskKey } from "@/lib/mock-data";

/** Combine "how abandoned" (idle days) with "how scary" (complexity) → 0–4. */
export function riskScore(file: GraveyardFile): number {
  const idle = file.days_idle || 0;
  const cx = file.max_complexity || 0;
  return Math.min(idle / 365, 2) + Math.min(cx / 15, 2);
}

export type RiskMeta = {
  key: RiskKey;
  label: string;
  badge: "risk-high" | "risk-medium" | "risk-low";
  dot: string;
  accent: string; // gradient for the card top bar
  ring: string;
};

/** Map a file to its risk bucket + presentational tokens. */
export function riskLevel(file: GraveyardFile): RiskMeta {
  const score = riskScore(file);
  if (score >= 2.4)
    return {
      key: "high",
      label: "High risk",
      badge: "risk-high",
      dot: "bg-rose-400",
      accent: "from-rose-500 to-orange-500",
      ring: "ring-rose-400/30",
    };
  if (score >= 1.2)
    return {
      key: "medium",
      label: "Watch",
      badge: "risk-medium",
      dot: "bg-amber-300",
      accent: "from-amber-400 to-yellow-500",
      ring: "ring-amber-300/30",
    };
  return {
    key: "low",
    label: "Stable",
    badge: "risk-low",
    dot: "bg-emerald-300",
    accent: "from-emerald-400 to-cyan-500",
    ring: "ring-emerald-300/25",
  };
}

/** Split a repo-relative path into filename + parent dir. */
export function splitPath(path: string) {
  const parts = path.split(/[\\/]/);
  const name = parts.pop() ?? path;
  return { name, dir: parts.join("/") };
}
