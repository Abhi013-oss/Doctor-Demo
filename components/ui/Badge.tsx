import React from "react";
import { cn } from "../../utils/cn";
import { StatusVariant } from "../../types/common";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: StatusVariant;
  size?: "sm" | "md";
}

export function Badge({ className, variant = "slate", size = "md", children, ...props }: BadgeProps) {
  const variantStyles: Record<StatusVariant, string> = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    teal: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    slate: "bg-slate-800 text-slate-300 border-slate-700",
    sky: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full border tracking-wide uppercase",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
