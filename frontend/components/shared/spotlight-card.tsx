"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SpotlightCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Tailwind color for the spotlight, as an rgb/rgba string. */
  glow?: string;
  as?: "div" | "article";
};

/**
 * A surface with a soft radial glow that follows the cursor, plus a gentle lift
 * on hover. The glow is a pure CSS layer driven by `--mx` / `--my` custom
 * properties updated on pointer move — cheap, GPU-friendly, and inert when the
 * pointer isn't over the card (opacity 0). Decorative only.
 */
export function SpotlightCard({
  className,
  children,
  glow = "rgba(140,69,255,0.18)",
  as = "div",
  ...props
}: SpotlightCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const Tag = as as any;

  return (
    <Tag
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group/spot relative overflow-hidden transition-transform duration-300 hover:-translate-y-1",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 65%)`,
        }}
      />
      <span className="relative z-10 block h-full">{children}</span>
    </Tag>
  );
}
