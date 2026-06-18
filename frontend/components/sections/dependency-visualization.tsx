import { Share2, AlertTriangle, Trash2 } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { GlowOrb } from "@/components/shared/glow-orb";
import { Badge } from "@/components/ui/badge";
import { DependencyGraphScene } from "@/components/three/dependency-graph-scene.lazy";

const INSIGHTS = [
  { icon: Share2, label: "Import & call graph", value: "12,480 edges" },
  { icon: AlertTriangle, label: "Circular dependencies", value: "7 cycles" },
  { icon: Trash2, label: "Unreachable / dead code", value: "143 files" },
];

export function DependencyVisualization() {
  return (
    <SectionShell
      id="dependencies"
      backdrop={
        <>
          <GlowOrb className="left-1/3 top-0 h-[30rem] w-[30rem]" color="bg-excav-cyan/10" />
          <GlowOrb className="right-10 bottom-0 h-[24rem] w-[24rem]" color="bg-excav-violetDeep/25" animate="drift" />
        </>
      }
    >
      <SectionHeading
        eyebrow="Dependency Visualization"
        title="Untangle how everything connects"
        description="An interactive force-directed graph of your entire dependency surface. Spot hubs, cycles, and the dead code hiding in plain sight."
      />

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        {/* 3D graph */}
        <Reveal>
          <div className="relative aspect-[16/11] w-full overflow-hidden rounded-3xl border border-white/10 glass">
            <DependencyGraphScene />
            <Badge
              variant="default"
              className="absolute left-4 top-4 font-mono"
            >
              acme/payments-core · live graph
            </Badge>
          </div>
        </Reveal>

        {/* Insight stats */}
        <div className="flex flex-col gap-4">
          {INSIGHTS.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.08}>
              <div className="glass flex items-center gap-4 rounded-2xl p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-excav-cyan/10 ring-1 ring-excav-cyan/25">
                  <it.icon className="h-5 w-5 text-excav-cyan" />
                </span>
                <div>
                  <div className="font-display text-xl text-slate-100">
                    {it.value}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">
                    {it.label}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.26}>
            <p className="px-1 text-sm leading-relaxed text-muted-foreground">
              Click any node to isolate its blast radius — every file it touches,
              and everything that touches it.
            </p>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
