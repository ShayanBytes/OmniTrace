"use client";

import { Rocket, LifeBuoy, Scale, ShieldAlert, Check } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { GlowOrb } from "@/components/shared/glow-orb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const CASES = [
  {
    id: "onboarding",
    label: "Onboarding",
    icon: Rocket,
    headline: "Ramp engineers in hours, not weeks",
    body: "New hires get a guided map of the system, a reading order, and AI explanations for the gnarly files — so they ship with confidence on day one.",
    points: [
      "Auto-generated architecture overview",
      "Suggested reading order for any module",
      "“Explain this file” for unfamiliar code",
    ],
  },
  {
    id: "legacy",
    label: "Legacy rescue",
    icon: LifeBuoy,
    headline: "Tame the code nobody understands",
    body: "Inherited a 10-year-old monolith? OmniTrace surfaces the load-bearing files, the dead ends, and the original intent buried in commit history.",
    points: [
      "Find abandoned, high-risk files fast",
      "Recover lost intent from git history",
      "Safe-to-delete vs. load-bearing signals",
    ],
  },
  {
    id: "debt",
    label: "Tech-debt triage",
    icon: Scale,
    headline: "Prioritize debt with real signal",
    body: "Stop arguing from vibes. Rank refactors by a fused score of complexity, churn, and blast radius — and bring receipts to planning.",
    points: [
      "Complexity × churn × idle-time scoring",
      "Blast-radius estimates per change",
      "Exportable, shareable reports",
    ],
  },
  {
    id: "audits",
    label: "Audits & reviews",
    icon: ShieldAlert,
    headline: "Map risk before you sign off",
    body: "Due diligence, security reviews, and architecture audits start with a complete, local picture of how the system actually fits together.",
    points: [
      "Whole-repo dependency surface",
      "Circular dependency & cycle detection",
      "100% local — nothing leaves the room",
    ],
  },
];

export function UseCases() {
  return (
    <SectionShell
      id="use-cases"
      backdrop={<GlowOrb className="right-1/4 top-10 h-[26rem] w-[26rem]" color="bg-excav-violetInk/40" animate="drift" />}
    >
      <SectionHeading
        eyebrow="Use Cases"
        title="Built for the hardest part of software"
        description="Understanding code you didn't write. OmniTrace fits wherever comprehension is the bottleneck."
      />

      <Tabs defaultValue="onboarding" className="mt-12">
        <TabsList className="mx-auto flex max-w-full flex-wrap">
          {CASES.map((c) => (
            <TabsTrigger key={c.id} value={c.id}>
              <c.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{c.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {CASES.map((c) => (
          <TabsContent key={c.id} value={c.id}>
            <div className="glass grid gap-8 rounded-3xl p-8 lg:grid-cols-2 lg:p-10">
              <div>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-excav-violet/15 text-excav-lilac ring-1 ring-excav-violet/30">
                  <c.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-2xl text-slate-100">
                  {c.headline}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {c.body}
                </p>
              </div>
              <ul className="flex flex-col justify-center gap-3">
                {c.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 ring-1 ring-white/5"
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-400/15">
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                    </span>
                    <span className="text-sm text-slate-200">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </SectionShell>
  );
}
