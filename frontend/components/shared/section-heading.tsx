import * as React from "react";

import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

/** Eyebrow + gradient H2 + supporting copy, used at the top of each section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-excav-lilac">
          <span className="h-px w-6 bg-excav-violet/60" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-h2 text-gradient">{title}</h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
