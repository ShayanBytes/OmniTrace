import { Lock, Wifi, KeyRound } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { GlowOrb } from "@/components/shared/glow-orb";
import { Badge } from "@/components/ui/badge";
import { ProviderLogo } from "@/components/shared/provider-logo";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { PROVIDERS } from "@/lib/mock-data";

const GUARANTEES = [
  { icon: Lock, title: "Private by default", body: "Run Ollama locally — code and prompts never touch the network." },
  { icon: KeyRound, title: "Bring your own key", body: "Prefer the cloud? Use your own OpenAI or Anthropic key. We never store it." },
  { icon: Wifi, title: "Works offline", body: "Full archaeology with no internet connection when using local models." },
];

export function LocalLLM() {
  return (
    <SectionShell
      id="local-llm"
      backdrop={<GlowOrb className="right-1/4 top-0 h-[28rem] w-[28rem]" color="bg-excav-violetInk/40" />}
    >
      <SectionHeading
        eyebrow="Local LLM Processing"
        title="Your AI, your machine, your rules"
        description="OmniTrace is provider-agnostic. Default to a fully local model, or plug in any API — the analysis pipeline stays identical."
      />

      {/* Provider grid */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROVIDERS.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.07}>
            <SpotlightCard className="glass group flex h-full flex-col gap-3 rounded-2xl p-5 transition-shadow hover:shadow-card">
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-excav-violet/15 text-excav-lilac ring-1 ring-excav-violet/30 transition-transform duration-300 group-hover:scale-110">
                  <ProviderLogo id={p.id} />
                </span>
                <Badge variant={p.local ? "risk-low" : "default"}>{p.badge}</Badge>
              </div>
              <div>
                <h3 className="font-medium text-slate-100">{p.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {p.tagline}
                </p>
              </div>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                {p.models.slice(0, 3).map((m) => (
                  <span
                    key={m}
                    className="rounded-md bg-black/40 px-2 py-0.5 font-mono text-[10px] text-slate-400 ring-1 ring-white/5"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      {/* Privacy guarantees */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {GUARANTEES.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.08}>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <g.icon className="mt-0.5 h-5 w-5 shrink-0 text-excav-cyan" />
              <div>
                <h3 className="text-sm font-medium text-slate-100">{g.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {g.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
