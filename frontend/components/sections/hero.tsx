import { ArrowRight, ShieldCheck, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/shared/reveal";
import { GlowOrb } from "@/components/shared/glow-orb";
import { GridBackdrop } from "@/components/shared/grid-backdrop";
import { HeroScene } from "@/components/three/hero-scene.lazy";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-32"
    >
      {/* Ambient depth */}
      <GridBackdrop />
      <GlowOrb className="-left-24 top-10 h-[34rem] w-[34rem]" color="bg-excav-violetDeep/30" />
      <GlowOrb
        className="right-[-10rem] top-1/3 h-[28rem] w-[28rem]"
        color="bg-excav-cyan/10"
        animate="drift"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div className="flex flex-col items-start gap-6">
          <Reveal>
            <Badge variant="violet">
              <span className="h-1.5 w-1.5 rounded-full bg-excav-cyan" />
              Local-first repository intelligence
            </Badge>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="font-display text-h1 text-gradient">
              Excavate the story
              <br />
              hidden in your{" "}
              <span className="text-gradient-brand">codebase</span>.
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              OmniTrace maps architecture, visualizes dependencies, and explains
              forgotten code with AI that runs on your machine. Understand any
              repository in minutes — not weeks.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild variant="gradient" size="lg">
                <a href="#demo">
                  Explore the demo
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#intelligence">
                  <Terminal className="h-5 w-5" />
                  See how it works
                </a>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm text-slate-400">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-excav-cyan" />
                Your code never leaves your machine
              </span>
              <span className="font-mono text-xs text-slate-500">
                $ pip install omnitrace
              </span>
            </div>
          </Reveal>
        </div>

        {/* 3D hero scene (lazy R3F; poster fallback until loaded) */}
        <Reveal delay={0.1} className="relative">
          <div className="relative aspect-square w-full">
            <HeroScene />
          </div>
        </Reveal>
      </div>

      {/* Scroll hint */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[11px] uppercase tracking-[0.3em] text-slate-600">
        scroll to dig
      </div>
    </section>
  );
}
