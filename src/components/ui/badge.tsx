import React from "react";

interface BadgeProps {
  variant?: "primary" | "success" | "warning" | "danger" | "neutral" | "accent";
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "neutral", children, className = "" }: BadgeProps) {
  const variants = {
    primary: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    success: "bg-brand-success/15 text-brand-success border-brand-success/20",
    warning: "bg-brand-warning/15 text-brand-warning border-brand-warning/20",
    danger: "bg-brand-danger/15 text-brand-danger border-brand-danger/20",
    neutral: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-border",
    accent: "bg-brand-accent/15 text-brand-accent border-brand-accent/20"
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
