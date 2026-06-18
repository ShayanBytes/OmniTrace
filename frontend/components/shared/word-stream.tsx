"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type WordStreamProps = {
  /** The full text to reveal progressively. */
  text: string;
  className?: string;
  /** Whether streaming is active. When false, the full text shows at once. */
  active?: boolean;
  /** Milliseconds between words. */
  speed?: number;
  /** Show a blinking caret while streaming. */
  caret?: boolean;
};

/**
 * Reveals text one word at a time, like an AI typing out a response. Restarts
 * whenever `text` changes. Under reduced-motion (or when inactive) the full
 * text renders immediately.
 */
export function WordStream({
  text,
  className,
  active = true,
  speed = 28,
  caret = true,
}: WordStreamProps) {
  const reduce = useReducedMotion();
  const words = React.useMemo(() => text.split(/(\s+)/), [text]);
  const [count, setCount] = React.useState(reduce || !active ? words.length : 0);

  React.useEffect(() => {
    if (reduce || !active) {
      setCount(words.length);
      return;
    }
    setCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= words.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [words, active, reduce, speed]);

  const done = count >= words.length;

  return (
    <span className={cn(className)}>
      {words.slice(0, count).join("")}
      {caret && !reduce && !done && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] -translate-y-[1px] animate-pulse bg-excav-lilac align-middle" />
      )}
    </span>
  );
}
