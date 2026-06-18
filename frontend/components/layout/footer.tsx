import { Github, Twitter } from "lucide-react";

import { Logo } from "@/components/shared/logo";

const COLUMNS = [
  {
    title: "Product",
    links: ["Intelligence", "Architecture", "Dependencies", "Semantic search", "Local LLM"],
  },
  {
    title: "Resources",
    links: ["Documentation", "CLI reference", "Changelog", "Roadmap", "Status"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Security", "Contact"],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-14">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Local-first code archaeology. Understand any repository — your code
            never leaves your machine.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="GitHub"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-white/25 hover:text-white"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="X / Twitter"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-white/25 hover:text-white"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-200">{col.title}</h3>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground transition hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
        <span>© {new Date().getFullYear()} OmniTrace. All rights reserved.</span>
        <span className="font-mono">Built for developers · Local-first · BYO LLM</span>
      </div>
    </footer>
  );
}
