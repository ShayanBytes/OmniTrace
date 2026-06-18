"use client";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

export type SortKey = "idle" | "risk" | "complexity" | "name";
export type RiskFilter = "all" | "high" | "medium" | "low";

export const SORTS: { id: SortKey; label: string }[] = [
  { id: "idle", label: "Most idle" },
  { id: "risk", label: "Highest risk" },
  { id: "complexity", label: "Most complex" },
  { id: "name", label: "Name (A–Z)" },
];

const RISK_CHIPS: { id: RiskFilter; label: string; dot: string }[] = [
  { id: "all", label: "All", dot: "bg-slate-400" },
  { id: "high", label: "High", dot: "bg-rose-400" },
  { id: "medium", label: "Watch", dot: "bg-amber-300" },
  { id: "low", label: "Stable", dot: "bg-emerald-300" },
];

export function GraveyardToolbar({
  search,
  setSearch,
  sort,
  setSort,
  risk,
  setRisk,
  counts,
  shown,
  total,
  searchRef,
}: {
  search: string;
  setSearch: (v: string) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  risk: RiskFilter;
  setRisk: (r: RiskFilter) => void;
  counts: Record<"high" | "medium" | "low", number>;
  shown: number;
  total: number;
  searchRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <div className="glass mb-4 flex flex-col gap-3 rounded-2xl p-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative lg:max-w-xs lg:flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter files…  (press /)"
          className="w-full rounded-xl bg-black/40 py-2 pl-9 pr-8 text-sm text-slate-100 placeholder-slate-500 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-excav-violet/70"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-white"
            title="Clear"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {RISK_CHIPS.map((c) => {
            const active = risk === c.id;
            const n = c.id === "all" ? total : counts[c.id] || 0;
            return (
              <button
                key={c.id}
                onClick={() => setRisk(c.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ring-1 transition",
                  active
                    ? "bg-excav-violet/20 text-slate-100 ring-excav-violet/70"
                    : "bg-black/30 text-slate-400 ring-white/10 hover:ring-white/25"
                )}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                {c.label}
                <span className="text-[10px] text-slate-500">{n}</span>
              </button>
            );
          })}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-xl bg-black/40 px-3 py-2 text-xs text-slate-200 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-excav-violet/70"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id} className="bg-excav-panel">
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
}
