import { Star, GitFork, Quote } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { GlowOrb } from "@/components/shared/glow-orb";
import { SpotlightCard } from "@/components/shared/spotlight-card";

const PROJECTS = [
  {
    name: "django/django",
    lang: "Python",
    langColor: "bg-emerald-400",
    stat: "12,940 files mapped",
    note: "Surfaced 38 abandoned modules in the ORM layer.",
    stars: "78k",
    forks: "31k",
  },
  {
    name: "facebook/react",
    lang: "JavaScript",
    langColor: "bg-amber-300",
    stat: "6,210 files mapped",
    note: "Traced the reconciler's evolution across 9 years.",
    stars: "227k",
    forks: "46k",
  },
  {
    name: "kubernetes/kubernetes",
    lang: "Go",
    langColor: "bg-excav-cyan",
    stat: "21,480 files mapped",
    note: "Detected 14 circular dependencies in scheduler.",
    stars: "110k",
    forks: "39k",
  },
];

const QUOTE = {
  text: "OmniTrace turned a codebase nobody wanted to touch into something my whole team could reason about. Onboarding went from weeks to an afternoon.",
  author: "Staff Engineer",
  org: "fintech platform, 2M LOC monorepo",
};

export function ProjectShowcase() {
  return (
    <SectionShell
      id="showcase"
      backdrop={<GlowOrb className="left-1/4 top-0 h-[26rem] w-[26rem]" color="bg-excav-violetInk/40" />}
    >
      <SectionHeading
        eyebrow="Project Showcase"
        title="Battle-tested on real codebases"
        description="From small services to million-line monorepos — OmniTrace scales to whatever you point it at."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <SpotlightCard className="glass group h-full rounded-2xl p-6 transition-shadow hover:shadow-card">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-slate-100">{p.name}</span>
                <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className={`h-2 w-2 rounded-full ${p.langColor} ${"animate-pulse"}`} />
                  {p.lang}
                </span>
              </div>
              <div className="mt-4 font-display text-xl text-gradient">{p.stat}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.note}
              </p>
              <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-amber-300">
                  <Star className="h-3.5 w-3.5" /> {p.stars}
                </span>
                <span className="flex items-center gap-1.5 transition-colors group-hover:text-slate-300">
                  <GitFork className="h-3.5 w-3.5" /> {p.forks}
                </span>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>

      {/* Testimonial */}
      <Reveal className="mt-8">
        <figure className="glass relative overflow-hidden rounded-3xl p-8 lg:p-10">
          <Quote className="absolute right-8 top-8 h-16 w-16 text-excav-violet/15" />
          <blockquote className="relative max-w-3xl font-display text-xl leading-relaxed text-slate-100 sm:text-2xl">
            “{QUOTE.text}”
          </blockquote>
          <figcaption className="mt-6 text-sm text-slate-400">
            <span className="font-medium text-slate-200">{QUOTE.author}</span> ·{" "}
            {QUOTE.org}
          </figcaption>
        </figure>
      </Reveal>
    </SectionShell>
  );
}
