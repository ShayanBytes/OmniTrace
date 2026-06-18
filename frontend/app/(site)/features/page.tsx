import type { Metadata } from "next";

import { KeyFeatures } from "@/components/sections/key-features";
import { ArchitectureMapping } from "@/components/sections/architecture-mapping";
import { DependencyVisualization } from "@/components/sections/dependency-visualization";
import { SemanticSearch } from "@/components/sections/semantic-search";
import { LocalLLM } from "@/components/sections/local-llm";
import { ContactCTA } from "@/components/sections/contact-cta";
import { GlowOrb } from "@/components/shared/glow-orb";
import { GridBackdrop } from "@/components/shared/grid-backdrop";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "OmniTrace — Features",
  description:
    "Dependency intelligence, architecture mapping, semantic search, and local-first AI reports — the full OmniTrace code-intelligence toolkit.",
};

export default function FeaturesPage() {
  return (
    <main>
      {/* Page header */}
      <section className="relative overflow-hidden px-6 pb-8 pt-36 text-center">
        <GridBackdrop />
        <GlowOrb className="left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2" color="bg-excav-violetDeep/30" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <Badge variant="violet" className="mx-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-excav-cyan" />
            Everything in the box
          </Badge>
          <h1 className="mt-6 font-display text-h1 text-gradient">
            The complete code-intelligence toolkit
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Every capability that helps you understand a codebase you didn&apos;t
            write — from dependency graphs to local AI reports.
          </p>
        </div>
      </section>

      <KeyFeatures />
      <ArchitectureMapping />
      <DependencyVisualization />
      <SemanticSearch />
      <LocalLLM />
      <ContactCTA />
    </main>
  );
}
