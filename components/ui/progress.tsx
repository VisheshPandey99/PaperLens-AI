import * as React from "react";
import { cn } from "./button";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indicatorClassName?: string;
}

export function Progress({ className, value = 0, max = 100, indicatorClassName, ...props }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary/80", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 bg-brand-500 transition-all duration-500 ease-out", indicatorClassName)}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
}
