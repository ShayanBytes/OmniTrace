import * as React from "react";

import { cn } from "@/lib/utils";

type CodeWindowProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  /** Optional element pinned to the right of the title bar (e.g. a badge). */
  toolbar?: React.ReactNode;
};

/**
 * A faux terminal / editor chrome — traffic-light dots, a title, and a glass
 * body. Used by the product demo and several code-flavored sections.
 */
export function CodeWindow({
  title = "omnitrace",
  children,
  className,
  toolbar,
}: CodeWindowProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-[#0a0712]/90 shadow-card backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-rose-500/80" />
        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
        <span className="ml-3 truncate font-mono text-xs text-slate-400">
          {title}
        </span>
        {toolbar && <div className="ml-auto">{toolbar}</div>}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
