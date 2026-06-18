"use client";

import * as React from "react";
import {
  animate,
  useInView,
  useReducedMotion,
} from "framer-motion";

type AnimatedCounterProps = {
  value: number;
  className?: string;
  /** Number of decimal places. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
};

/** Counts up from 0 → value when scrolled into view. */
export function AnimatedCounter({
  value,
  className,
  decimals = 0,
  prefix = "",
  suffix = "",
}: AnimatedCounterProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
