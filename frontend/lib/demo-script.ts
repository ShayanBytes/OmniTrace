/**
 * Scripted steps for the simulated Interactive Product Demo (section 7).
 * Pure data — the component drives a small state machine over these phases.
 */
export type DemoPhase = {
  id: "idle" | "scanning" | "graveyard" | "analyzing" | "report";
  command: string;
  status: string;
};

export const DEMO_PHASES: DemoPhase[] = [
  {
    id: "idle",
    command: "omnitrace trace ./acme/payments-core",
    status: "Ready to excavate.",
  },
  {
    id: "scanning",
    command: "omnitrace trace ./acme/payments-core",
    status: "Reading git history locally · scoring complexity (Lizard)…",
  },
  {
    id: "graveyard",
    command: "omnitrace trace ./acme/payments-core",
    status: "Surfaced 12 abandoned files, ranked by risk.",
  },
  {
    id: "analyzing",
    command: "omnitrace explain invoice_reconciler.py",
    status: "Generating archaeology report · llama3.1 (Ollama, local)…",
  },
  {
    id: "report",
    command: "omnitrace explain invoice_reconciler.py",
    status: "Report ready — nothing left your machine.",
  },
];

/** Convenience accessor for the demo's example overview stat line. */
export const DEMO_SCAN_STATS = [
  { label: "commits", value: "14,238" },
  { label: "files", value: "2,167" },
  { label: "contributors", value: "63" },
  { label: "abandoned", value: "12" },
];
