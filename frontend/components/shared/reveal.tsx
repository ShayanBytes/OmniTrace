"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import * as React from "react";

import { fadeUp, inView } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: "div" | "section" | "li" | "span";
};

/**
 * In-view reveal wrapper. Honors prefers-reduced-motion by rendering content
 * immediately with no transform.
 */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
