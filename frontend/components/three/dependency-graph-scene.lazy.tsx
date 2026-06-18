"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

import { SceneFallback } from "@/components/three/scene-fallback";
import { useInViewOnce } from "@/lib/use-in-view-once";

const Impl = dynamic(
  () => import("@/components/three/dependency-graph-scene"),
  { ssr: false, loading: () => <SceneFallback variant="graph" /> }
);

/** Lazy boundary for the dependency-graph scene (reduced-motion + in-view gated). */
export function DependencyGraphScene() {
  const reduce = useReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>("300px");

  return (
    <div ref={ref} className="absolute inset-0">
      {reduce || !inView ? <SceneFallback variant="graph" /> : <Impl />}
    </div>
  );
}
