"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

import { SectionShell } from "@/components/shared/section-shell";
import { Reveal } from "@/components/shared/reveal";
import { GlowOrb } from "@/components/shared/glow-orb";
import { GridBackdrop } from "@/components/shared/grid-backdrop";
import { Button } from "@/components/ui/button";

// Pre-computed radial burst directions for the success confetti puff.
const BURST = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  const colors = ["#8c45ff", "#43e7ff", "#ffb347", "#b372cf"];
  return {
    x: Math.cos(a) * (44 + (i % 3) * 14),
    y: Math.sin(a) * (44 + (i % 3) * 14),
    color: colors[i % colors.length],
  };
});

export function ContactCTA() {
  const reduce = useReducedMotion();
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
  }

  return (
    <SectionShell
      id="contact"
      className="py-28 lg:py-36"
      backdrop={
        <>
          <GridBackdrop />
          <GlowOrb className="left-1/2 top-1/4 h-[32rem] w-[32rem] -translate-x-1/2" color="bg-excav-violetDeep/30" />
        </>
      }
    >
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs text-slate-300 backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-excav-cyan" />
          Early access · open beta soon
        </span>

        <h2 className="mt-6 font-display text-h2 text-gradient">
          Stop guessing what your code does
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Join the developers excavating clarity from their codebases. Local-first,
          provider-agnostic, and free to start.
        </p>

        {/* Email capture */}
        <form
          onSubmit={onSubmit}
          className="relative mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          {/* Success confetti puff, centered on the form. */}
          <AnimatePresence>
            {sent && !reduce && (
              <div className="pointer-events-none absolute left-1/2 top-1/2 z-20">
                {BURST.map((p, i) => (
                  <motion.span
                    key={i}
                    className="absolute h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: p.color }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.dev"
            disabled={sent}
            className="h-12 flex-1 rounded-xl bg-black/40 px-4 text-sm text-slate-100 placeholder-slate-500 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-excav-violet/70 disabled:opacity-60"
          />
          <Button type="submit" variant="gradient" size="lg" disabled={sent}>
            {sent ? (
              <>
                <Check className="h-5 w-5" />
                You&apos;re on the list
              </>
            ) : (
              <>
                Get early access
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            No credit card
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            Runs locally
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            Bring your own model
          </span>
        </div>
      </Reveal>
    </SectionShell>
  );
}
