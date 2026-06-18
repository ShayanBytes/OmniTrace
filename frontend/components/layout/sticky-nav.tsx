"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";

type NavLink = { href: string; label: string; route?: boolean };

// Mix of real routes and landing anchors. Anchors resolve to "/#id" so they
// work from any page (Next navigates home, then scrolls to the section).
const NAV: NavLink[] = [
  { href: "/features", label: "Features", route: true },
  { href: "/#demo", label: "Demo" },
  { href: "/#showcase", label: "Showcase" },
  { href: "/docs", label: "Docs", route: true },
];

export function StickyNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [hovered, setHovered] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (l: NavLink) => l.route && pathname === l.href;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className={cn(
            "flex items-center rounded-2xl px-2 py-1 transition-all",
            scrolled && "glass px-3"
          )}
          aria-label="OmniTrace — home"
        >
          <Logo />
        </Link>

        <nav
          onMouseLeave={() => setHovered(null)}
          className={cn(
            "hidden items-center gap-1 rounded-full px-2 py-1.5 transition-all lg:flex",
            scrolled ? "glass border border-white/10" : "border border-transparent"
          )}
        >
          {NAV.map((l) => {
            const active = isActive(l);
            const lit = hovered ? hovered === l.href : active;
            return (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setHovered(l.href)}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm transition-colors",
                  lit ? "text-white" : "text-muted-foreground"
                )}
              >
                {lit && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-excav-violet/20 ring-1 ring-excav-violet/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="gradient" size="sm">
            <Link href="/app">
              Open App
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mb-8">
                <Logo />
              </div>
              <nav className="flex flex-col gap-1">
                {NAV.map((l) => (
                  <SheetClose asChild key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "rounded-xl px-3 py-2.5 text-sm transition-colors",
                        isActive(l)
                          ? "bg-excav-violet/20 text-white"
                          : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <SheetClose asChild>
                <Button asChild variant="gradient" className="mt-8 w-full">
                  <Link href="/app">Open App</Link>
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
