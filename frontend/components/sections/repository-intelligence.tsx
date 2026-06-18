import { GitCommitHorizontal, Files, Users, GitBranch } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { GlowOrb } from "@/components/shared/glow-orb";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { FileCard } from "@/components/shared/file-card";
import { BarMeter } from "@/components/shared/charts/bar-meter";
import { DEMO_OVERVIEW, DEMO_GRAVEYARD } from "@/lib/mock-data";
import { riskLevel } from "@/lib/risk";

const STATS = [
  { icon: GitCommitHorizontal, label: "Commits analyzed", value: DEMO_OVERVIEW.total_commits },
  { icon: Files, label: "Files tracked", value: DEMO_OVERVIEW.total_files },
  { icon: Users, label: "Contributors", value: DEMO_OVERVIEW.contributors },
  { icon: GitBranch, label: "Active branches", value: 8 },
];

export function RepositoryIntelligence() {
  // Top 4 highest-risk artifacts for the preview row.
  const preview = DEMO_GRAVEYARD.slice(0, 4);

  // Risk distribution across the full demo graveyard, for the animated meter.
  const riskCounts = DEMO_GRAVEYARD.reduce(
    (acc, f) => {
      acc[riskLevel(f).key] += 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0 } as Record<"high" | "medium" | "low", number>
  );
  const riskBars = [
    { label: "High risk", value: riskCounts.high, color: "bg-gradient-to-r from-rose-500 to-orange-500" },
    { label: "Watch", value: riskCounts.medium, color: "bg-gradient-to-r from-amber-400 to-yellow-500" },
    { label: "Stable", value: riskCounts.low, color: "bg-gradient-to-r from-emerald-400 to-cyan-500" },
  ];

  return (
    <SectionShell
      id="intelligence"
      backdrop={<GlowOrb className="left-1/4 top-0 h-[26rem] w-[26rem]" color="bg-excav-violetInk/40" />}
    >
      <SectionHeading
        eyebrow="Repository Intelligence"
        title="A complete read on any repo, instantly"
        description="Point OmniTrace at a repository and it indexes the entire git history locally — commits, contributors, complexity, and the files everyone forgot about."
      />

      <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div className="glass rounded-2xl p-5 transition-shadow hover:shadow-card">
              <s.icon className="h-5 w-5 text-excav-lilac" />
              <div className="mt-4 font-display text-3xl text-gradient sm:text-4xl">
                <AnimatedCounter value={s.value} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                {s.label}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-8">
        <div className="glass rounded-2xl p-5 sm:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              Risk distribution
            </h3>
            <span className="text-[11px] text-slate-500">
              across {DEMO_GRAVEYARD.length} abandoned files
            </span>
          </div>
          <BarMeter data={riskBars} />
        </div>
      </Reveal>

      <div className="mt-14">
        <Reveal className="mb-4 flex items-center gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
            The graveyard
          </h3>
          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-400 ring-1 ring-white/10">
            most abandoned files, ranked by risk
          </span>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {preview.map((file, i) => (
            <Reveal key={file.path} delay={i * 0.05}>
              <FileCard file={file} compact />
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
