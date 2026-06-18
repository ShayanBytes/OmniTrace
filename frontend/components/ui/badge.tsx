import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/15 bg-black/40 text-slate-300 backdrop-blur",
        violet:
          "border-excav-violet/30 bg-excav-violet/15 text-excav-lilac",
        outline: "border-white/15 text-foreground",
        "risk-high": "border-rose-400/30 bg-rose-500/10 text-rose-300",
        "risk-medium": "border-amber-300/30 bg-amber-400/10 text-amber-200",
        "risk-low": "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
