import { Monitor, Server, GitFork, Cpu, ArrowDown } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { GlowOrb } from "@/components/shared/glow-orb";

const LAYERS = [
  {
    icon: Monitor,
    title: "Client",
    subtitle: "Next.js + React UI",
    tags: ["Visualizations", "Graphs", "Reports"],
    accent: "border-excav-violet/30 bg-excav-violet/[0.06]",
  },
  {
    icon: Server,
    title: "Local engine",
    subtitle: "FastAPI service on your machine",
    tags: ["/api/scan", "/api/analyze", "/api/health"],
    accent: "border-excav-cyan/25 bg-excav-cyan/[0.05]",
  },
  {
    icon: GitFork,
    title: "Analysis layer",
    subtitle: "GitPython · Lizard complexity",
    tags: ["Git history", "Cyclomatic complexity", "Risk scoring"],
    accent: "border-amber-400/25 bg-amber-400/[0.05]",
  },
  {
    icon: Cpu,
    title: "Model layer",
    subtitle: "Provider-agnostic LLM router",
    tags: ["Ollama (local)", "OpenAI", "Anthropic", "Custom"],
    accent: "border-emerald-400/25 bg-emerald-400/[0.05]",
  },
];

export function TechnicalArchitecture() {
  return (
    <SectionShell
      id="tech-architecture"
      backdrop={<GlowOrb className="left-1/3 top-0 h-[28rem] w-[28rem]" color="bg-excav-violetInk/40" />}
    >
      <SectionHeading
        eyebrow="Technical Architecture"
        title="A local-first pipeline, end to end"
        description="Everything runs on your machine by default. The only thing that ever leaves — if you choose a cloud model — is the single file you ask about."
      />

      <div className="mx-auto mt-12 flex max-w-2xl flex-col items-stretch gap-3">
        {LAYERS.map((layer, i) => (
          <Reveal key={layer.title} delay={i * 0.08}>
            <div
              className={`relative rounded-2xl border ${layer.accent} p-5 backdrop-blur`}
            >
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-black/40 ring-1 ring-white/10">
                  <layer.icon className="h-5 w-5 text-slate-200" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-display text-lg text-slate-100">
                      {layer.title}
                    </h3>
                    <span className="truncate text-xs text-slate-400">
                      {layer.subtitle}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {layer.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-black/40 px-2 py-0.5 font-mono text-[10px] text-slate-400 ring-1 ring-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {i < LAYERS.length - 1 && (
              <div className="flex justify-center py-0.5">
                <ArrowDown className="h-4 w-4 text-slate-600" />
              </div>
            )}
          </Reveal>
        ))}
      </div>

      <Reveal className="mx-auto mt-8 max-w-2xl">
        <p className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-xs text-slate-400">
          <span className="font-mono text-excav-cyan">git analysis</span> stays
          on-device · API keys are sent only with a request and never persisted
        </p>
      </Reveal>
    </SectionShell>
  );
}
