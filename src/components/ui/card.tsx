import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export default function Card({ children, className = "", hoverable = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-card border border-border rounded-xl p-5 shadow-2xs transition-all duration-200 ${
        hoverable
          ? "hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs cursor-pointer"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
