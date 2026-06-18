import { Download, FolderGit2, Radar, BookOpenCheck } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { GlowOrb } from "@/components/shared/glow-orb";

const STEPS = [
  {
    icon: Download,
    n: "01",
    title: "Install",
    body: "One command. No account, no cloud setup.",
    code: "$ pip install omnitrace",
  },
  {
    icon: FolderGit2,
    n: "02",
    title: "Point at a repo",
    body: "Aim OmniTrace at any local git repository.",
    code: "$ omnitrace trace ./my-project",
  },
  {
    icon: Radar,
    n: "03",
    title: "Scan",
    body: "It indexes history and scores every file locally.",
    code: "→ 2,167 files · 12 abandoned",
  },
  {
    icon: BookOpenCheck,
    n: "04",
    title: "Understand",
    body: "Explore the map and ask AI to explain anything.",
    code: "$ omnitrace explain reconciler.py",
  },
];

export function DeveloperWorkflow() {
  return (
    <SectionShell
      id="workflow"
      backdrop={<GlowOrb className="right-10 top-1/4 h-[24rem] w-[24rem]" color="bg-excav-violetDeep/25" animate="drift" />}
    >
      <SectionHeading
        eyebrow="Developer Workflow"
        title="From clone to clarity in four steps"
        description="OmniTrace drops into the workflow you already have. No instrumentation, no config, no waiting."
      />

      <div className="relative mt-14">
        {/* Connecting line (desktop) — a flowing dashed beam between steps. */}
        <svg
          aria-hidden
          className="absolute left-0 right-0 top-7 hidden h-px w-full lg:block"
          preserveAspectRatio="none"
          viewBox="0 0 100 1"
        >
          <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="rgba(140,69,255,0.18)" strokeWidth="1" />
          <line
            x1="0"
            y1="0.5"
            x2="100"
            y2="0.5"
            stroke="#8c45ff"
            strokeWidth="1"
            strokeDasharray="6 10"
            className="animate-dash"
          />
        </svg>

        <div className="grid gap-6 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="group relative flex flex-col gap-4">
                <span className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-excav-violet to-excav-violetDeep shadow-glow ring-1 ring-white/15 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
                  <s.icon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-excav-lilac">{s.n}</span>
                    <h3 className="font-display text-lg text-slate-100">{s.title}</h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
                <code className="rounded-lg bg-black/40 px-3 py-2 font-mono text-[11px] text-slate-300 ring-1 ring-white/10">
                  {s.code}
                </code>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
