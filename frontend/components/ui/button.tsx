import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Brand CTA — violet→bright gradient with the signature top glow.
        gradient:
          "bg-gradient-to-r from-excav-violet to-excav-violetBright text-white shadow-cta ring-1 ring-white/15 hover:brightness-110",
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "glass-bright text-white hover:brightness-110",
        outline:
          "border border-white/15 bg-white/5 text-foreground hover:bg-white/10 hover:border-white/25",
        ghost: "text-muted-foreground hover:bg-white/5 hover:text-foreground",
        link: "text-excav-lilac underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-11 px-5",
        lg: "h-13 px-7 text-base [&_svg]:size-5 h-[3.25rem]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
