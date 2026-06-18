"use client";

import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import * as React from "react";

import { fadeUp } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
};

/**
 * In-view reveal wrapper — fail-safe by design.
 *
 * `initial={false}` means NO opacity:0 is ever baked into the server HTML: the
 * element renders at its visible "show" state on the server and first client
 * paint, so the page is always readable even if JS is slow or fails. After
 * mount, elements that are still below the fold are armed to fade in on scroll;
 * elements already on screen simply stay visible (no flash). Honors
 * prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
}: RevealProps) {
  // `any` ref: MotionTag is a union (div/section/li/span) so a concrete element
  // type won't satisfy every branch; useInView accepts any Element ref.
  const ref = React.useRef<any>(null);
  const reduce = useReducedMotion();
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = motion[as];

  // Until mounted, render "show" (visible). After mount, off-screen elements
  // drop to "hidden" and fade in when scrolled into view; on-screen ones stay.
  const animate = !mounted || isInView ? "show" : "hidden";

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={variants}
      initial={false}
      animate={animate}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
