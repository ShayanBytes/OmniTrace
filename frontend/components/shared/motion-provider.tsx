"use client";

import { MotionConfig } from "framer-motion";

/**
 * Global Framer Motion config. `reducedMotion="user"` makes every motion
 * component respect the OS "reduce motion" setting automatically: transform and
 * layout animations are disabled (values snap to their target) while opacity /
 * color still animate — a safety net on top of the per-component `useReducedMotion`
 * guards and the global CSS animation kill-switch in globals.css.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
