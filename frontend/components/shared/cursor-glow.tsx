"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * A soft violet glow that springs toward the pointer — a subtle "the page is
 * alive and tracking you" cue. Fixed, pointer-events-none, behind content but
 * above the aurora. Disabled on touch devices and under reduced-motion.
 */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = React.useState(false);

  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  React.useEffect(() => {
    // Only enable for fine pointers (mouse), not touch.
    const fine = window.matchMedia?.("(pointer: fine)").matches;
    if (reduce || !fine) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed -z-[5] h-[28rem] w-[28rem] rounded-full bg-excav-violet/10 blur-[120px]"
      style={{ left: sx, top: sy, translateX: "-50%", translateY: "-50%" }}
    />
  );
}
