import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = {
  title: "OmniTrace — Console",
  description:
    "Scan a local git repository, surface its most abandoned files, and generate AI archaeology reports.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* App top bar (distinct from the marketing nav) */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-excav-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" aria-label="OmniTrace — home">
            <Logo />
          </Link>
          <span className="hidden font-mono text-xs text-slate-500 sm:block">
            console
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/25 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
