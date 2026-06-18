import { cn } from "@/lib/utils";

/**
 * OmniTrace wordmark: a terminal-glyph tile (`>_`) + gradient name.
 * The chevron is a crisp SVG path; the cursor underscore is tinted cyan and
 * gently blinks (disabled under reduced motion via the global CSS rule).
 */
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
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          {/* chevron ">" */}
          <path
            d="M7 8.5 L11 12 L7 15.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* blinking cursor "_" */}
          <line
            x1="12.5"
            y1="15.5"
            x2="17"
            y2="15.5"
            stroke="#43e7ff"
            strokeWidth="2"
            strokeLinecap="round"
            className="animate-pulse"
          />
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
