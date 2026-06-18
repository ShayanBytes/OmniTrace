"use client";

import * as React from "react";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { NAV_SECTIONS, SECTIONS } from "@/lib/sections";
import { useActiveSection } from "@/lib/use-active-section";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";

const ALL_IDS = SECTIONS.map((s) => s.id);

export function StickyNav() {
  const [scrolled, setScrolled] = React.useState(false);
  const active = useActiveSection(ALL_IDS);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2.5" : "py-4"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <a
          href="#hero"
          className={cn(
            "flex items-center rounded-2xl px-2 py-1 transition-all",
            scrolled && "glass !rounded-2xl px-3"
          )}
          aria-label="OmniTrace — home"
        >
          <Logo />
        </a>

        {/* Desktop nav */}
        <nav
          className={cn(
            "hidden items-center gap-1 rounded-full px-2 py-1.5 transition-all lg:flex",
            scrolled
              ? "glass border border-white/10"
              : "border border-transparent"
          )}
        >
          {NAV_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition-colors",
                active === s.id
                  ? "bg-excav-violet/20 text-white"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="gradient"
            size="sm"
            className="hidden sm:inline-flex"
          >
            <a href="#contact">Get early access</a>
          </Button>

          {/* Mobile drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="mb-8">
                <Logo />
              </div>
              <nav className="flex flex-col gap-1">
                {SECTIONS.filter((s) => s.id !== "hero").map((s) => (
                  <SheetClose asChild key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={cn(
                        "rounded-xl px-3 py-2.5 text-sm transition-colors",
                        active === s.id
                          ? "bg-excav-violet/20 text-white"
                          : "text-muted-foreground hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {s.label}
                    </a>
                  </SheetClose>
                ))}
              </nav>
              <SheetClose asChild>
                <Button asChild variant="gradient" className="mt-8 w-full">
                  <a href="#contact">Get early access</a>
                </Button>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
