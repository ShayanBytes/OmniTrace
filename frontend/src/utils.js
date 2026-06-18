/**
 * utils.js
 * --------
 * Small pure helpers shared across components.
 */

/** Format an ISO date as a short, human "3 months ago"-ish label. */
export function timeAgo(isoString) {
  if (!isoString) return "unknown";
  const then = new Date(isoString).getTime();
  const days = Math.max(0, Math.floor((Date.now() - then) / 86_400_000));
  if (days < 1) return "today";
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  const years = (days / 365).toFixed(1).replace(/\.0$/, "");
  return `${years}y ago`;
}

/**
 * Combine "how abandoned" (days idle) with "how scary" (complexity) into a
 * single risk bucket that drives a card's accent color. Old + complex = the
 * stuff most likely to bite you, so it glows red.
 */
export function riskLevel(file) {
  const idle = file.days_idle || 0;
  const cx = file.max_complexity || 0;
  const score = Math.min(idle / 365, 2) + Math.min(cx / 15, 2);

  if (score >= 2.4)
    return {
      key: "high",
      label: "High risk",
      ring: "ring-rose-400/40",
      glow: "shadow-[0_18px_60px_-22px_rgba(244,63,94,0.7)]",
      accent: "from-rose-500 to-orange-500",
      dot: "bg-rose-400",
      text: "text-rose-300",
    };
  if (score >= 1.2)
    return {
      key: "medium",
      label: "Watch",
      ring: "ring-amber-300/40",
      glow: "shadow-[0_18px_60px_-22px_rgba(251,191,36,0.6)]",
      accent: "from-amber-400 to-yellow-500",
      dot: "bg-amber-300",
      text: "text-amber-200",
    };
  return {
    key: "low",
    label: "Stable",
    ring: "ring-emerald-300/30",
    glow: "shadow-[0_18px_60px_-22px_rgba(52,211,153,0.5)]",
    accent: "from-emerald-400 to-cyan-500",
    dot: "bg-emerald-300",
    text: "text-emerald-200",
  };
}

/** Pull a readable filename + parent dir out of a repo-relative path. */
export function splitPath(path) {
  const parts = path.split(/[\\/]/);
  const name = parts.pop();
  const dir = parts.join("/");
  return { name, dir };
}
