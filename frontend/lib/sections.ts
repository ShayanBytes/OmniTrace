/**
 * Single source of truth for the page's section anchors. Drives the sticky
 * nav, the mobile drawer, and scroll-spy. The `nav` flag controls which
 * sections appear as primary nav links (we don't list all 13 to keep it clean).
 */
export type SectionDef = {
  id: string;
  label: string;
  nav?: boolean;
};

export const SECTIONS: SectionDef[] = [
  { id: "hero", label: "Home" },
  { id: "intelligence", label: "Intelligence", nav: true },
  { id: "architecture", label: "Architecture", nav: true },
  { id: "dependencies", label: "Dependencies", nav: true },
  { id: "search", label: "Search", nav: true },
  { id: "local-llm", label: "Local LLM", nav: true },
  { id: "demo", label: "Demo", nav: true },
  { id: "features", label: "Features", nav: true },
  { id: "use-cases", label: "Use cases" },
  { id: "tech-architecture", label: "How it works" },
  { id: "workflow", label: "Workflow" },
  { id: "showcase", label: "Showcase" },
  { id: "contact", label: "Contact", nav: true },
];

export const NAV_SECTIONS = SECTIONS.filter((s) => s.nav);
