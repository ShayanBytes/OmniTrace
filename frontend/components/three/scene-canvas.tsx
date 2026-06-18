"use client";

import * as React from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { AdaptiveDpr, Preload } from "@react-three/drei";

/**
 * Shared R3F <Canvas> wrapper with sane defaults for a marketing page:
 * capped DPR, high-performance GL, adaptive DPR under load, and Preload so
 * assets warm before first paint. Always client-only (imported via .lazy
 * wrappers with ssr:false).
 */
export function SceneCanvas({
  children,
  className,
  ...props
}: CanvasProps & { className?: string }) {
  return (
    <Canvas
      className={className}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      {...props}
    >
      {children}
      <AdaptiveDpr pixelated />
      <Preload all />
    </Canvas>
  );
}
