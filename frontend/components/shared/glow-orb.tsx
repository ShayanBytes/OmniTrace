import { cn } from "@/lib/utils";

type GlowOrbProps = {
  className?: string;
  /** Tailwind color utility, e.g. "bg-excav-violet/25". */
  color?: string;
  animate?: "float" | "drift" | "none";
};

/**
 * A large, soft, blurred color blob for ambient depth. Decorative only —
 * always pointer-events-none and aria-hidden.
 */
export function GlowOrb({
  className,
  color = "bg-excav-violetDeep/30",
  animate = "float",
}: GlowOrbProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full blur-[150px]",
        color,
        animate === "float" && "animate-float",
        animate === "drift" && "animate-drift",
        className
      )}
    />
  );
}
