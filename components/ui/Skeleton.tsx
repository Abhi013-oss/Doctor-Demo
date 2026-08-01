import React from "react";
import { cn } from "../../utils/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className, variant = "rectangular", ...props }: SkeletonProps) {
  const variantStyles = {
    text: "h-3 w-full rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-slate-800/80 border border-slate-800/50",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-1/3 h-4" />
            <Skeleton variant="text" className="w-2/3 h-3" />
          </div>
          <Skeleton variant="rectangular" className="w-20 h-8" />
        </div>
      ))}
    </div>
  );
}
