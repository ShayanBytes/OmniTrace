"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { wordContainer, wordChild } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AnimatedTextProps = {
  /** Plain text — split into words (or chars) and staggered in. */
  text: string;
  className?: string;
  /** Wrapper element. Defaults to a span (inline). */
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  /** Granularity of the stagger. */
  per?: "word" | "char";
  /** Delay before the whole reveal starts. */
  delay?: number;
  /** Per-item stagger (seconds). */
  stagger?: number;
  /**
   * Class applied to each word/char span. Use this for gradient text
   * (`text-gradient`) — `background-clip:text` must live on the painted span,
   * not the container, or split children render transparent.
   */
  wordClassName?: string;
  /**
   * Play the reveal once on mount, regardless of scroll position. Use for
   * above-the-fold content (the hero) that should animate in on first load —
   * in-view gating never fires an entrance for content already on screen.
   */
  entrance?: boolean;
};

/**
 * Reveals text word-by-word (or char-by-char) with a lift + de-blur, triggered
 * once when scrolled into view.
 *
 * Fail-safe like {@link Reveal}: server / first paint renders the text fully
 * visible (`initial={false}`), so it's always readable even if JS is slow. Only
 * after mount do off-screen instances arm the hidden→show stagger. Honors
 * prefers-reduced-motion (renders plain text).
 */
export function AnimatedText({
  text,
  className,
  as = "span",
  per = "word",
  delay = 0,
  stagger,
  wordClassName,
  entrance = false,
}: AnimatedTextProps) {
  const ref = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const Tag = as as any;

  if (reduce) {
    return (
      <Tag className={className}>
        <span className={wordClassName}>{text}</span>
      </Tag>
    );
  }

  const units =
    per === "char" ? Array.from(text) : text.split(/(\s+)/); // keep whitespace tokens
  const step = stagger ?? (per === "char" ? 0.018 : 0.045);

  // Entrance: play hidden→show on hydration (hero requires JS anyway). Default:
  // fail-safe — render "show" on the server and only arm a hidden→show reveal
  // for content that mounts below the fold.
  const initial = entrance ? "hidden" : false;
  const animate = entrance ? "show" : !mounted || isInView ? "show" : "hidden";

  const MotionTag = (motion as any)[as];

  return (
    <MotionTag
      ref={ref}
      className={cn(className)}
      variants={wordContainer(step, delay)}
      initial={initial}
      animate={animate}
      aria-label={text}
    >
      {units.map((u: string, i: number) => {
        const isSpace = /^\s+$/.test(u);
        if (isSpace) {
          return (
            <span key={i} aria-hidden style={{ whiteSpace: "pre" }}>
              {u}
            </span>
          );
        }
        return (
          <motion.span
            key={i}
            aria-hidden
            variants={wordChild}
            className={cn("inline-block whitespace-pre will-change-transform", wordClassName)}
          >
            {u}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}
