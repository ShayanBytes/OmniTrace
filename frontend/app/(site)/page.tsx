import { Hero } from "@/components/sections/hero";
import { RepositoryIntelligence } from "@/components/sections/repository-intelligence";
import { ArchitectureMapping } from "@/components/sections/architecture-mapping";
import { DependencyVisualization } from "@/components/sections/dependency-visualization";
import { SemanticSearch } from "@/components/sections/semantic-search";
import { LocalLLM } from "@/components/sections/local-llm";
import { ProductDemo } from "@/components/sections/product-demo";
import { KeyFeatures } from "@/components/sections/key-features";
import { UseCases } from "@/components/sections/use-cases";
import { TechnicalArchitecture } from "@/components/sections/technical-architecture";
import { DeveloperWorkflow } from "@/components/sections/developer-workflow";
import { ProjectShowcase } from "@/components/sections/project-showcase";
import { ContactCTA } from "@/components/sections/contact-cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <RepositoryIntelligence />
      <ArchitectureMapping />
      <DependencyVisualization />
      <SemanticSearch />
      <LocalLLM />
      <ProductDemo />
      <KeyFeatures />
      <UseCases />
      <TechnicalArchitecture />
      <DeveloperWorkflow />
      <ProjectShowcase />
      <ContactCTA />
    </main>
  );
}
