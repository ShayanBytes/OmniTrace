"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

import { SceneFallback } from "@/components/three/scene-fallback";
import { useInViewOnce } from "@/lib/use-in-view-once";

// Heavy R3F scene — client-only, never server-rendered (three touches WebGL).
const HeroSceneImpl = dynamic(() => import("@/components/three/hero-scene"), {
  ssr: false,
  loading: () => <SceneFallback variant="constellation" />,
});

/**
 * Lazy boundary for the hero scene. Under reduced-motion we render the 2D
 * poster and never import the three chunk. Otherwise we mount the canvas once
 * the hero scrolls into view.
 */
export function HeroScene() {
  const reduce = useReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>("300px");

  return (
    <div ref={ref} className="absolute inset-0">
      {reduce || !inView ? (
        <SceneFallback variant="constellation" />
      ) : (
        <HeroSceneImpl />
      )}
    </div>
  );
}
