import { cn } from "@/lib/utils";

/**
 * A faint dotted "dig grid" layer, fading out toward the edges. Decorative.
 * Place inside a `relative` container with content above it (z-indexed).
 */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]",
        className
      )}
    >
      {/* The dotted dig-grid, breathing slowly. */}
      <div className="absolute inset-0 bg-grid-fade [background-size:28px_28px] animate-float" />
      {/* A faint scan-beam sweeping horizontally, like a survey pass. */}
      <div className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-excav-cyan/[0.06] to-transparent animate-beam" />
    </div>
  );
}
