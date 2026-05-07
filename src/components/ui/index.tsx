import { cn } from "@/lib/utils";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-slate-900 text-white hover:bg-slate-900/90": variant === "primary",
            "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm": variant === "secondary",
            "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900": variant === "outline",
            "hover:bg-slate-100 hover:text-slate-900": variant === "ghost",
            "h-9 px-4 py-2": size === "sm",
            "h-12 px-8 py-2 text-base": size === "md",
            "h-14 rounded-full px-10 text-lg": size === "lg",
            "h-12 w-12": size === "icon",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[32px] border border-slate-100 bg-white text-slate-950 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
