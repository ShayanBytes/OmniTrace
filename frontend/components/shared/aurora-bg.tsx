import { cn } from "@/lib/utils";

/**
 * Fixed, full-viewport ambient layer: a few large, blurred, slowly-roaming
 * color blobs that give the whole site a gentle living "aurora" behind the
 * content. Purely decorative — pointer-events-none, aria-hidden, behind all
 * content (negative z). Animations pause under prefers-reduced-motion via the
 * global CSS rule in globals.css.
 */
export function AuroraBg({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <div className="absolute -left-[10%] top-[-10%] h-[42rem] w-[42rem] rounded-full bg-excav-violetDeep/25 blur-[160px] animate-aurora" />
      <div className="absolute right-[-12%] top-[20%] h-[36rem] w-[36rem] rounded-full bg-excav-cyan/10 blur-[150px] animate-aurora-slow" />
      <div className="absolute bottom-[-15%] left-[25%] h-[40rem] w-[40rem] rounded-full bg-excav-violet/15 blur-[170px] animate-aurora [animation-delay:-12s]" />
    </div>
  );
}
