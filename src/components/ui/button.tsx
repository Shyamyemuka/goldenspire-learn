import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl border-2 border-primary/50 hover:border-primary transition-all duration-300 hover:shadow-[0_0_30px_hsl(43_66%_53%/0.3)]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-2 border-destructive/50 hover:border-destructive",
        outline: "border-2 border-primary/30 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/60 transition-all duration-300 hover:shadow-[0_0_20px_hsl(43_66%_53%/0.2)] relative overflow-hidden group",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2 border-primary/20 hover:border-primary/40",
        ghost: "hover:bg-accent/10 hover:text-accent border-2 border-transparent hover:border-primary/30",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-gold text-primary-foreground font-semibold shadow-[var(--shadow-gold)] hover:shadow-[0_0_60px_hsl(43_66%_53%/0.4)] hover:scale-105 transition-all duration-300 border-2 border-primary",
        premium: "bg-card border-2 border-primary/30 text-foreground hover:border-primary/60 hover:bg-primary/5 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_25px_hsl(43_66%_53%/0.25)] relative overflow-hidden group",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4",
        lg: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
