// GraveyardToolbar.jsx
// Controls that sit above the masonry grid: live filename search, a sort
// selector, and risk-filter chips. All filtering/sorting happens in App;
// this component is purely presentational.
import { forwardRef } from "react";

export const SORTS = [
  { id: "idle", label: "Most idle" },
  { id: "risk", label: "Highest risk" },
  { id: "complexity", label: "Most complex" },
  { id: "name", label: "Name (A–Z)" },
];

const RISK_CHIPS = [
  { id: "all", label: "All", dot: "bg-slate-400" },
  { id: "high", label: "High", dot: "bg-rose-400" },
  { id: "medium", label: "Watch", dot: "bg-amber-300" },
  { id: "low", label: "Stable", dot: "bg-emerald-300" },
];

const GraveyardToolbar = forwardRef(function GraveyardToolbar(
  { search, setSearch, sort, setSort, risk, setRisk, counts, shown, total },
  searchRef
) {
  return (
    <div className="glass mb-3 flex flex-col gap-3 rounded-2xl p-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search */}
      <div className="relative lg:max-w-xs lg:flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter files…  (press /)"
          className="w-full rounded-xl bg-black/40 py-2 pl-9 pr-8 text-sm text-slate-100 placeholder-slate-500 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-violet-400/70"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-slate-400 hover:text-white"
            title="Clear"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Risk chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {RISK_CHIPS.map((c) => {
            const active = risk === c.id;
            const n = c.id === "all" ? total : counts[c.id] || 0;
            return (
              <button
                key={c.id}
                onClick={() => setRisk(c.id)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ring-1 transition ${
                  active
                    ? "bg-violet-500/20 text-slate-100 ring-violet-400/70"
                    : "bg-black/30 text-slate-400 ring-white/10 hover:ring-white/25"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                {c.label}
                <span className="text-[10px] text-slate-500">{n}</span>
              </button>
            );
          })}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl bg-black/40 px-3 py-2 text-xs text-slate-200 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-violet-400/70"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id} className="bg-slate-900">
              Sort: {s.label}
            </option>
          ))}
        </select>

        <span className="text-[11px] text-slate-500">
          {shown} / {total}
        </span>
      </div>
    </div>
  );
});

export default GraveyardToolbar;
