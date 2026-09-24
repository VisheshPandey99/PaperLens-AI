import * as React from "react";
import { cn } from "./button";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "brand" | "success" | "warning";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground shadow": variant === "default",
          "border-transparent bg-secondary text-secondary-foreground": variant === "secondary",
          "border-transparent bg-destructive text-destructive-foreground": variant === "destructive",
          "text-foreground border-border": variant === "outline",
          "border-brand-500/20 bg-brand-500/10 text-brand-600 dark:text-brand-400": variant === "brand",
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400": variant === "success",
          "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400": variant === "warning",
        },
        className
      )}
      {...props}
    />
  );
}
