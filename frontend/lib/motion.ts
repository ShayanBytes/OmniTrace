import type { Variants } from "framer-motion";

/** Shared Framer Motion variants used across sections. */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Soft "lift + sharpen" reveal — fades up while a slight blur clears. */
export const blurUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Spring "pop" — used as a popIn variant or as a hover/tap target. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 24 },
  },
};

/** Tactile hover/tap spring for interactive elements. */
export const springPop = {
  whileHover: { scale: 1.04, transition: { type: "spring", stiffness: 400, damping: 18 } },
  whileTap: { scale: 0.96 },
} as const;

/** SVG line "draw" — animate `pathLength` 0 → 1 (set pathLength on the path). */
export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, ease: "easeInOut" }, opacity: { duration: 0.2 } },
  },
};

/** Per-word / per-char container — children should use `wordChild`. */
export const wordContainer = (staggerChildren = 0.045, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Single word/char that lifts + sharpens into place. */
export const wordChild: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Stagger container — children should use `fadeUp` / `scaleIn`. */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Default in-view config so reveals trigger once, slightly before fully visible. */
export const inView = { once: true, margin: "-80px" } as const;
