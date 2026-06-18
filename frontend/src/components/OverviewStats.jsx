// OverviewStats.jsx
// A responsive row of "dig site" summary tiles shown after a scan.
import { motion } from "framer-motion";

function StatTile({ label, value, hint, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="glass rounded-2xl p-4"
    >
      <div className="text-2xl font-bold text-gradient sm:text-3xl">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>
      {hint && <div className="mt-0.5 truncate text-[11px] text-slate-500">{hint}</div>}
    </motion.div>
  );
}

export default function OverviewStats({ overview }) {
  if (!overview) return null;

  const lastCommit = overview.last_commit_date
    ? new Date(overview.last_commit_date).toLocaleDateString()
    : "—";

  const tiles = [
    { label: "Commits", value: overview.total_commits, hint: `last: ${lastCommit}` },
    { label: "Tracked files", value: overview.total_files },
    { label: "Contributors", value: overview.contributors },
    { label: "Branch", value: overview.active_branch, hint: "active" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {tiles.map((t, i) => (
        <StatTile key={t.label} {...t} delay={i * 0.06} />
      ))}
    </div>
  );
}
