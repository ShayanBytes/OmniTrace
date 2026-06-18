/**
 * Mock data for the OmniTrace showcase site. Mirrors the real backend shapes
 * (scan overview + "graveyard" files + AI archaeology reports + AI providers)
 * so the simulated demo looks exactly like the product — but ships with the
 * static site and never calls /api/* at runtime.
 */

export type RiskKey = "high" | "medium" | "low";

export type GraveyardFile = {
  path: string;
  days_idle: number;
  author: string;
  message: string;
  last_commit: string; // ISO
  analyzed: boolean;
  nloc: number;
  function_count: number;
  max_complexity: number;
};

export type RepoOverview = {
  repo: string;
  total_commits: number;
  total_files: number;
  contributors: number;
  active_branch: string;
  last_commit_date: string; // ISO
};

export type Provider = {
  id: "ollama" | "openai" | "anthropic" | "custom";
  label: string;
  tagline: string;
  local: boolean;
  keyRequired: boolean;
  badge: string;
  models: string[];
};

// ---------------------------------------------------------------------------
// Repo overview (demo)
// ---------------------------------------------------------------------------
export const DEMO_OVERVIEW: RepoOverview = {
  repo: "acme/payments-core",
  total_commits: 14238,
  total_files: 2167,
  contributors: 63,
  active_branch: "main",
  last_commit_date: "2026-06-09T14:21:00Z",
};

// ---------------------------------------------------------------------------
// The "graveyard" — most abandoned files, ranked by idle days × complexity
// ---------------------------------------------------------------------------
export const DEMO_GRAVEYARD: GraveyardFile[] = [
  {
    path: "src/legacy/billing/invoice_reconciler.py",
    days_idle: 1284,
    author: "Priya Nair",
    message: "hotfix: clamp rounding on multi-currency refunds",
    last_commit: "2022-12-04T09:12:00Z",
    analyzed: true,
    nloc: 642,
    function_count: 28,
    max_complexity: 34,
  },
  {
    path: "src/core/auth/legacy_session_store.ts",
    days_idle: 968,
    author: "Marcus Hale",
    message: "wip: migrate to redis-backed sessions (do not delete)",
    last_commit: "2023-10-18T16:44:00Z",
    analyzed: true,
    nloc: 415,
    function_count: 19,
    max_complexity: 22,
  },
  {
    path: "services/etl/transform_ledger_v1.go",
    days_idle: 845,
    author: "Dana Liu",
    message: "temporary shim until v2 ledger lands",
    last_commit: "2024-02-19T11:03:00Z",
    analyzed: true,
    nloc: 388,
    function_count: 14,
    max_complexity: 27,
  },
  {
    path: "src/utils/currency/fx_rate_cache.js",
    days_idle: 612,
    author: "Tomás Reyes",
    message: "fix stale cache eviction under high load",
    last_commit: "2024-10-09T08:30:00Z",
    analyzed: true,
    nloc: 211,
    function_count: 11,
    max_complexity: 16,
  },
  {
    path: "src/reporting/quarterly_export.py",
    days_idle: 540,
    author: "Aiko Tanaka",
    message: "add CSV streaming for large exports",
    last_commit: "2024-12-20T13:55:00Z",
    analyzed: true,
    nloc: 297,
    function_count: 9,
    max_complexity: 12,
  },
  {
    path: "src/webhooks/stripe_dispatcher.ts",
    days_idle: 487,
    author: "Marcus Hale",
    message: "retry with exponential backoff on 5xx",
    last_commit: "2025-02-11T10:14:00Z",
    analyzed: true,
    nloc: 256,
    function_count: 13,
    max_complexity: 9,
  },
  {
    path: "scripts/migrations/0042_backfill_accounts.sql",
    days_idle: 731,
    author: "Priya Nair",
    message: "one-off backfill — keep for audit trail",
    last_commit: "2024-06-15T07:20:00Z",
    analyzed: false,
    nloc: 0,
    function_count: 0,
    max_complexity: 0,
  },
  {
    path: "src/core/fraud/heuristics_v0.py",
    days_idle: 1102,
    author: "Dana Liu",
    message: "freeze v0 rules ahead of ML rollout",
    last_commit: "2023-06-10T18:02:00Z",
    analyzed: true,
    nloc: 503,
    function_count: 22,
    max_complexity: 31,
  },
  {
    path: "src/ui/legacy/dashboard_widgets.jsx",
    days_idle: 398,
    author: "Aiko Tanaka",
    message: "deprecate in favor of widgets-v2",
    last_commit: "2025-05-09T15:40:00Z",
    analyzed: true,
    nloc: 334,
    function_count: 17,
    max_complexity: 14,
  },
  {
    path: "services/notifications/sms_gateway.rb",
    days_idle: 656,
    author: "Tomás Reyes",
    message: "switch provider credentials to vault",
    last_commit: "2024-08-26T12:11:00Z",
    analyzed: true,
    nloc: 188,
    function_count: 8,
    max_complexity: 7,
  },
  {
    path: "src/core/ledger/double_entry.java",
    days_idle: 421,
    author: "Marcus Hale",
    message: "guard against negative balance drift",
    last_commit: "2025-04-16T09:48:00Z",
    analyzed: true,
    nloc: 472,
    function_count: 25,
    max_complexity: 19,
  },
  {
    path: "src/integrations/quickbooks_sync.cs",
    days_idle: 583,
    author: "Priya Nair",
    message: "handle token refresh edge cases",
    last_commit: "2024-11-07T14:33:00Z",
    analyzed: true,
    nloc: 366,
    function_count: 16,
    max_complexity: 21,
  },
];

// ---------------------------------------------------------------------------
// AI providers (mirrors the real provider-agnostic backend)
// ---------------------------------------------------------------------------
export const PROVIDERS: Provider[] = [
  {
    id: "ollama",
    label: "Ollama",
    tagline: "Runs entirely on your machine. Private by default.",
    local: true,
    keyRequired: false,
    badge: "Local · Free",
    models: ["llama3.1", "qwen2.5-coder", "codellama", "mistral", "phi3"],
  },
  {
    id: "openai",
    label: "OpenAI",
    tagline: "Bring your own key — Chat Completions API.",
    local: false,
    keyRequired: true,
    badge: "Cloud · BYO key",
    models: ["gpt-4o", "gpt-4o-mini", "gpt-4.1", "o3-mini"],
  },
  {
    id: "anthropic",
    label: "Anthropic",
    tagline: "Claude models via the Messages API.",
    local: false,
    keyRequired: true,
    badge: "Cloud · BYO key",
    models: ["claude-opus-4-8", "claude-sonnet-4-6", "claude-haiku-4-5"],
  },
  {
    id: "custom",
    label: "Custom / OpenAI-compatible",
    tagline: "Groq, OpenRouter, LM Studio, vLLM — any compatible endpoint.",
    local: false,
    keyRequired: true,
    badge: "Self-host · Flexible",
    models: ["llama-3.3-70b-versatile", "deepseek-r1-distill-70b", "mixtral-8x7b"],
  },
];

// ---------------------------------------------------------------------------
// AI "Archaeology Report" generator (canned, keyed off file path)
// ---------------------------------------------------------------------------
export function demoReport(file: GraveyardFile): {
  report: string;
  commit_messages: string[];
  code: string;
} {
  return {
    report: `**${file.path.split("/").pop()}** exists to reconcile and transform financial records that the newer pipeline still depends on indirectly — it was the system of record before the v2 rewrite, and several downstream jobs were never fully migrated off it. The most recent substantive change (${file.author}, ${new Date(file.last_commit).toLocaleDateString()}) patched an edge case rather than adding features, which is the classic signature of a load-bearing file kept on life support. With a max cyclomatic complexity of ${file.max_complexity} across ${file.function_count} functions and ${file.days_idle} days of silence, it's high-risk to revive blindly: read the guarded branches around error handling first, and confirm nothing still imports it before deprecating.`,
    commit_messages: [
      file.message,
      "refactor: extract validation into helpers",
      "test: cover multi-currency rounding paths",
      "perf: memoize repeated lookups",
      "chore: bump internal schema version",
    ],
    code: `def reconcile(batch: LedgerBatch) -> ReconResult:
    # NOTE(priya, 2022): rounding must clamp BEFORE fx conversion
    total = Decimal("0")
    for entry in batch.entries:
        rate = fx_cache.get(entry.currency) or fetch_rate(entry.currency)
        total += (entry.amount * rate).quantize(CENTS, ROUND_HALF_EVEN)
    return ReconResult(total=total, drift=batch.expected - total)`,
  };
}
