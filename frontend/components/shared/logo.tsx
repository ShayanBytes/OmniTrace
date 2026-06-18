import { cn } from "@/lib/utils";

/** OmniTrace wordmark: a magnifier-with-clock-hand mark + gradient name. */
export function Logo({
  className,
  showWord = true,
}: {
  className?: string;
  showWord?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-excav-violet to-excav-violetDeep shadow-glow ring-1 ring-white/15">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-3.6-3.6" />
          <path d="M11 8v3l2 2" />
        </svg>
      </span>
      {showWord && (
        <span className="font-display text-lg tracking-heading text-gradient">
          OmniTrace
        </span>
      )}
    </span>
  );
}
