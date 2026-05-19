import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "moss";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          "min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7613B] focus-visible:ring-offset-2",
          {
            "bg-[#C7613B] text-[#FAF6F0] hover:bg-[#b85430] shadow-sm": variant === "primary",
            "bg-[#E4D9CC] text-[#2E2620] hover:bg-[#d4c9bc]": variant === "secondary",
            "bg-transparent text-[#2E2620] hover:bg-[#E4D9CC]": variant === "ghost",
            "bg-[#2E2620] text-[#FAF6F0] hover:bg-[#1a1410]": variant === "destructive",
            "bg-[#4A6741] text-[#FAF6F0] hover:bg-[#3a5231]": variant === "moss",
          },
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-4 py-2 text-base": size === "md",
            "px-6 py-3 text-lg": size === "lg",
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
