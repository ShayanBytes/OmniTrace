"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, Sparkles, FileCode2 } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { SectionHeading } from "@/components/shared/section-heading";
import { GlowOrb } from "@/components/shared/glow-orb";
import { Badge } from "@/components/ui/badge";

type Result = { path: string; snippet: string; score: number };

const QUERIES: { q: string; results: Result[] }[] = [
  {
    q: "where do we handle multi-currency rounding?",
    results: [
      { path: "src/legacy/billing/invoice_reconciler.py", snippet: "clamp rounding BEFORE fx conversion…", score: 0.94 },
      { path: "src/utils/currency/fx_rate_cache.js", snippet: "quantize(CENTS, ROUND_HALF_EVEN)", score: 0.88 },
      { path: "src/core/ledger/double_entry.java", snippet: "guard against negative balance drift", score: 0.81 },
    ],
  },
  {
    q: "retry logic for failed webhooks",
    results: [
      { path: "src/webhooks/stripe_dispatcher.ts", snippet: "retry with exponential backoff on 5xx", score: 0.96 },
      { path: "services/notifications/sms_gateway.rb", snippet: "requeue on transient provider error", score: 0.79 },
      { path: "src/core/queue/backoff.ts", snippet: "jitter = base * 2 ** attempt", score: 0.74 },
    ],
  },
  {
    q: "how are sessions stored?",
    results: [
      { path: "src/core/auth/legacy_session_store.ts", snippet: "migrate to redis-backed sessions", score: 0.92 },
      { path: "src/core/auth/cookie.ts", snippet: "signed, httpOnly, sameSite=strict", score: 0.83 },
      { path: "config/redis.ts", snippet: "session TTL = 30m sliding", score: 0.7 },
    ],
  },
];

export function SemanticSearch() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = React.useState(0);
  const [typed, setTyped] = React.useState("");

  const current = QUERIES[idx];

  // Type out the query, hold, then advance to the next example.
  React.useEffect(() => {
    if (reduce) {
      setTyped(current.q);
      return;
    }
    let char = 0;
    setTyped("");
    const typer = setInterval(() => {
      char++;
      setTyped(current.q.slice(0, char));
      if (char >= current.q.length) clearInterval(typer);
    }, 38);
    const advance = setTimeout(() => {
      setIdx((i) => (i + 1) % QUERIES.length);
    }, 5200);
    return () => {
      clearInterval(typer);
      clearTimeout(advance);
    };
  }, [idx, current.q, reduce]);

  const ready = typed === current.q;

  return (
    <SectionShell
      id="search"
      backdrop={<GlowOrb className="left-10 top-10 h-[26rem] w-[26rem]" color="bg-excav-violetDeep/25" />}
    >
      <SectionHeading
        eyebrow="Semantic Code Search"
        title="Ask your codebase in plain English"
        description="Search by meaning, not just text. OmniTrace embeds your code so you can find concepts, patterns, and intent — even when you don't know the keyword."
      />

      <div className="mx-auto mt-12 max-w-3xl">
        <div className="glass rounded-2xl p-2 shadow-card">
          {/* Query bar */}
          <div className="flex items-center gap-3 rounded-xl bg-black/40 px-4 py-3.5 ring-1 ring-white/10">
            <Search className="h-5 w-5 shrink-0 text-excav-lilac" />
            <span className="flex-1 truncate font-mono text-sm text-slate-100">
              {typed}
              {!ready && (
                <span className="ml-0.5 inline-block h-4 w-[2px] -translate-y-[1px] animate-pulse bg-excav-lilac align-middle" />
              )}
            </span>
            <Badge variant="violet" className="hidden sm:inline-flex">
              <Sparkles className="h-3 w-3" />
              semantic
            </Badge>
          </div>

          {/* Results */}
          <div className="mt-2 flex flex-col gap-1.5 p-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                className="flex flex-col gap-1.5"
              >
                {current.results.map((r, i) => (
                  <motion.div
                    key={r.path}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: ready ? 1 : 0.3, y: 0 }}
                    transition={{ delay: ready ? i * 0.08 : 0 }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/5"
                  >
                    <FileCode2 className="h-4 w-4 shrink-0 text-slate-500" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-mono text-xs text-slate-200">
                        {r.path}
                      </div>
                      <div className="truncate text-[11px] text-slate-500">
                        {r.snippet}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-md bg-excav-violet/15 px-2 py-0.5 font-mono text-[11px] text-excav-lilac">
                      {r.score.toFixed(2)}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">
          Embeddings computed locally · results ranked by cosine similarity
        </p>
      </div>
    </SectionShell>
  );
}
