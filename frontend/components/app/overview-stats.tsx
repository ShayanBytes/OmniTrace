"use client";

import { motion } from "framer-motion";

import { AnimatedCounter } from "@/components/shared/animated-counter";
import type { RepoOverview } from "@/lib/mock-data";

function Tile({
  label,
  value,
  hint,
  delay,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 300, damping: 24 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-4 transition-shadow hover:shadow-glow"
    >
      <div className="font-display text-2xl text-gradient sm:text-3xl">
        {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
      </div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>
      {hint && <div className="mt-0.5 truncate text-[11px] text-slate-500">{hint}</div>}
    </motion.div>
  );
}

export function OverviewStats({ overview }: { overview: RepoOverview }) {
  const lastCommit = overview.last_commit_date
    ? new Date(overview.last_commit_date).toLocaleDateString()
    : "—";

  const tiles = [
    { label: "Commits", value: overview.total_commits ?? "—", hint: `last: ${lastCommit}` },
    { label: "Tracked files", value: overview.total_files ?? "—" },
    { label: "Contributors", value: overview.contributors ?? "—" },
    { label: "Branch", value: overview.active_branch ?? "—", hint: "active" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {tiles.map((t, i) => (
        <Tile key={t.label} {...t} delay={i * 0.06} />
      ))}
    </div>
  );
}
