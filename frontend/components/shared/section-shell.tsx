import * as React from "react";

import { cn } from "@/lib/utils";

type SectionShellProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
  /** Optional decorative layer rendered behind content (orbs, grid, etc.). */
  backdrop?: React.ReactNode;
};

/**
 * Standard section wrapper: full-width anchor with consistent vertical rhythm,
 * a centered max-width container, and an optional decorative backdrop layer.
 */
export function SectionShell({
  id,
  children,
  className,
  backdrop,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden px-6 py-24 sm:py-28 lg:py-32",
        className
      )}
    >
      {backdrop}
      <div className="relative z-10 mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
