import type { Metadata } from "next";
import Link from "next/link";
import { Terminal, Cpu, ShieldCheck, ArrowUpRight } from "lucide-react";

import { GlowOrb } from "@/components/shared/glow-orb";
import { GridBackdrop } from "@/components/shared/grid-backdrop";
import { CodeWindow } from "@/components/shared/code-window";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROVIDER_LIST } from "@/lib/providers";

export const metadata: Metadata = {
  title: "OmniTrace — Docs",
  description:
    "Install OmniTrace, point it at a repo, and start understanding code. Local-first, bring-your-own-LLM.",
};

const TOC = [
  { id: "install", label: "Installation" },
  { id: "quickstart", label: "Quickstart" },
  { id: "providers", label: "AI providers" },
  { id: "privacy", label: "Privacy" },
];

export default function DocsPage() {
  return (
    <main>
      <section className="relative overflow-hidden px-6 pb-6 pt-36">
        <GridBackdrop />
        <GlowOrb className="right-1/4 top-0 h-[26rem] w-[26rem]" color="bg-excav-violetDeep/25" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Badge variant="violet" className="mx-auto">
            <Terminal className="h-3.5 w-3.5" />
            Documentation
          </Badge>
          <h1 className="mt-6 font-display text-h1 text-gradient">
            Get started in two minutes
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            OmniTrace runs locally. Install it, point it at a git repository, and
            bring whatever model you like.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 lg:grid-cols-[200px_1fr]">
        {/* TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">
              On this page
            </span>
            {TOC.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="text-sm text-muted-foreground transition hover:text-white"
              >
                {t.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex flex-col gap-12">
          <section id="install" className="scroll-mt-28">
            <h2 className="font-display text-2xl text-slate-100">Installation</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Install the CLI with pip. Python 3.10+ recommended.
            </p>
            <CodeWindow title="bash" className="mt-4">
              <pre className="font-mono text-sm text-slate-200">
                <span className="text-emerald-400">$</span> pip install omnitrace
              </pre>
            </CodeWindow>
          </section>

          <section id="quickstart" className="scroll-mt-28">
            <h2 className="font-display text-2xl text-slate-100">Quickstart</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Point OmniTrace at any local repository, then open the console to
              explore results and generate AI reports.
            </p>
            <CodeWindow title="bash" className="mt-4">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-200">
                <span className="text-emerald-400">$</span> omnitrace serve
                {"\n"}
                <span className="text-slate-500"># API on :8000 — then open the console</span>
                {"\n\n"}
                <span className="text-emerald-400">$</span> omnitrace trace ./my-project
              </pre>
            </CodeWindow>
            <Button asChild variant="secondary" className="mt-4">
              <Link href="/app">
                Open the console
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </section>

          <section id="providers" className="scroll-mt-28">
            <h2 className="font-display text-2xl text-slate-100">AI providers</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              OmniTrace is provider-agnostic. Configure one in the console&apos;s
              settings — the model field accepts any name the provider supports.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PROVIDER_LIST.map((p) => (
                <div
                  key={p.id}
                  className="glass rounded-xl p-4"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-excav-lilac" />
                    <span className="text-sm font-medium text-slate-100">
                      {p.label}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {p.help}
                  </p>
                  <code className="mt-3 block truncate rounded-md bg-black/40 px-2 py-1 font-mono text-[10px] text-slate-400 ring-1 ring-white/5">
                    {p.defaultModel || "any model"}
                  </code>
                </div>
              ))}
            </div>
          </section>

          <section id="privacy" className="scroll-mt-28">
            <h2 className="font-display text-2xl text-slate-100">Privacy</h2>
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.05] p-5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <div className="text-sm leading-relaxed text-slate-300">
                All git analysis runs on your machine. With a local model
                (Ollama) nothing leaves your computer at all. If you choose a
                cloud provider, your API key is sent only with the request and is
                never stored on a server.
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
