import { Layers, Boxes, Workflow, CheckCircle2 } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { GlowOrb } from "@/components/shared/glow-orb";
import { ArchitectureScene } from "@/components/three/architecture-scene.lazy";

const POINTS = [
  {
    icon: Layers,
    title: "Layered module map",
    body: "Automatically groups files into modules, layers, and bounded contexts — see the shape of the system, not just folders.",
  },
  {
    icon: Boxes,
    title: "Boundaries & ownership",
    body: "Detects architectural seams and where responsibilities blur, so refactors start from facts.",
  },
  {
    icon: Workflow,
    title: "Data & control flow",
    body: "Traces how requests and data move across layers, surfacing the paths that matter most.",
  },
];

export function ArchitectureMapping() {
  return (
    <SectionShell
      id="architecture"
      backdrop={<GlowOrb className="right-1/4 top-10 h-[28rem] w-[28rem]" color="bg-excav-violetDeep/25" animate="drift" />}
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Scene */}
        <Reveal className="order-2 lg:order-1">
          <div className="relative aspect-[4/3] w-full rounded-3xl border border-white/10 glass">
            <ArchitectureScene />
          </div>
        </Reveal>

        {/* Copy */}
        <div className="order-1 lg:order-2">
          <SectionHeading
            align="left"
            eyebrow="Architecture Mapping"
            title="See the system behind the files"
            description="OmniTrace reconstructs a living map of your architecture from the code itself — layers, modules, and the connections that hold them together."
          />

          <div className="mt-8 flex flex-col gap-5">
            {POINTS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08} className="flex gap-4">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-excav-violet/15 ring-1 ring-excav-violet/30">
                  <p.icon className="h-5 w-5 text-excav-lilac" />
                </span>
                <div>
                  <h3 className="flex items-center gap-2 font-medium text-slate-100">
                    {p.title}
                    <CheckCircle2 className="h-4 w-4 text-emerald-400/70" />
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
