import {
  GitGraph,
  ScanSearch,
  Brain,
  ShieldCheck,
  GaugeCircle,
  History,
  Boxes,
  FileSearch,
} from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { GlowOrb } from "@/components/shared/glow-orb";
import { SpotlightCard } from "@/components/shared/spotlight-card";
import { cn } from "@/lib/utils";

type Feature = {
  icon: React.ElementType;
  title: string;
  body: string;
  span?: string;
  accent?: string;
};

const FEATURES: Feature[] = [
  {
    icon: GitGraph,
    title: "Dependency intelligence",
    body: "A live graph of imports, calls, and cycles across the whole repo — with dead-code detection baked in.",
    span: "lg:col-span-2",
    accent: "text-excav-cyan",
  },
  {
    icon: Brain,
    title: "AI archaeology reports",
    body: "Plain-English explanations of why any file exists and what changed last.",
    accent: "text-excav-lilac",
  },
  {
    icon: ShieldCheck,
    title: "Local-first & private",
    body: "Git analysis runs offline; bring your own model. Code never leaves your machine.",
    accent: "text-emerald-300",
  },
  {
    icon: GaugeCircle,
    title: "Risk & complexity scoring",
    body: "Cyclomatic complexity, churn, and idle-time fused into one risk signal per file.",
    accent: "text-amber-300",
  },
  {
    icon: ScanSearch,
    title: "Semantic search",
    body: "Find concepts and intent across the codebase — not just string matches.",
    span: "lg:col-span-2",
    accent: "text-excav-cyan",
  },
  {
    icon: History,
    title: "History timelines",
    body: "Trace a file's evolution commit-by-commit, with the people behind each change.",
    accent: "text-excav-lilac",
  },
  {
    icon: Boxes,
    title: "Architecture maps",
    body: "Auto-grouped modules, layers, and boundaries reconstructed from the code.",
    accent: "text-excav-lilac",
  },
  {
    icon: FileSearch,
    title: "Onboarding paths",
    body: "Guided reading order so new engineers ramp on a system in hours, not weeks.",
    accent: "text-emerald-300",
  },
];

export function KeyFeatures() {
  return (
    <SectionShell
      id="features"
      backdrop={<GlowOrb className="left-10 top-1/3 h-[26rem] w-[26rem]" color="bg-excav-violetDeep/25" />}
    >
      <SectionHeading
        eyebrow="Key Features"
        title="Everything you need to understand code"
        description="A complete code-intelligence toolkit, designed for the moments you inherit a codebase you've never seen."
      />

      <div className="mt-12 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.06} className={f.span}>
            <SpotlightCard className="glass group h-full rounded-2xl p-6 transition-shadow hover:shadow-card">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.04] ring-1 ring-white/10 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
                <f.icon className={cn("h-5 w-5 transition-transform duration-300 group-hover:rotate-6", f.accent)} />
              </span>
              <h3 className="mt-4 font-display text-lg text-slate-100">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
