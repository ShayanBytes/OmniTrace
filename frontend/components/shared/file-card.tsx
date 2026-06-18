import { cn } from "@/lib/utils";
import { riskLevel, splitPath } from "@/lib/risk";
import type { GraveyardFile } from "@/lib/mock-data";
import { RiskBadge } from "@/components/shared/risk-badge";

type FileCardProps = {
  file: GraveyardFile;
  className?: string;
  /** Compact variant used in dense tables/previews. */
  compact?: boolean;
};

/** A single "artifact" card surfaced from the graveyard scan. */
export function FileCard({ file, className, compact }: FileCardProps) {
  const risk = riskLevel(file);
  const { name, dir } = splitPath(file.path);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl glass ring-1 transition-shadow hover:shadow-card",
        risk.ring,
        className
      )}
    >
      <div className={cn("h-1 w-full bg-gradient-to-r", risk.accent)} />
      <div className={cn("p-4", compact ? "sm:p-4" : "sm:p-5")}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className="truncate font-mono text-sm font-medium text-slate-100"
              title={file.path}
            >
              {name}
            </h3>
            {dir && (
              <p className="truncate text-[11px] text-slate-500" title={dir}>
                {dir}/
              </p>
            )}
          </div>
          <RiskBadge file={file} />
        </div>

        <div className="mt-4 flex items-end gap-2">
          <span className="font-display text-3xl leading-none text-gradient">
            {file.days_idle}
          </span>
          <span className="pb-0.5 text-xs text-slate-400">days idle</span>
        </div>

        {!compact && (
          <div className="mt-3 rounded-lg bg-black/30 p-2.5 ring-1 ring-white/5">
            <p className="line-clamp-2 text-xs italic text-slate-300">
              “{file.message}”
            </p>
            <p className="mt-1 text-[11px] text-slate-500">{file.author}</p>
          </div>
        )}

        {file.analyzed ? (
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <Metric value={file.nloc} label="lines" />
            <Metric value={file.function_count} label="funcs" />
            <Metric
              value={file.max_complexity}
              label="max cx"
              warn={file.max_complexity >= 15}
            />
          </div>
        ) : (
          <p className="mt-3 text-[11px] text-slate-500">
            Not a source file — complexity skipped.
          </p>
        )}
      </div>
    </article>
  );
}

function Metric({
  value,
  label,
  warn,
}: {
  value: number;
  label: string;
  warn?: boolean;
}) {
  return (
    <div className="rounded-lg bg-black/30 py-1.5 ring-1 ring-white/5">
      <div
        className={cn(
          "text-sm font-semibold",
          warn ? "text-rose-300" : "text-slate-100"
        )}
      >
        {value}
      </div>
      <div className="text-[10px] text-slate-500">{label}</div>
    </div>
  );
}
