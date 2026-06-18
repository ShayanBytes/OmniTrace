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
        "pointer-events-none absolute inset-0 bg-grid-fade [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]",
        className
      )}
    />
  );
}
