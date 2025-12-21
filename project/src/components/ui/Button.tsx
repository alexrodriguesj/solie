"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "whatsapp";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 rounded-full",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          {
            // Variants
            "bg-solie-green text-white hover:bg-solie-green/90 focus:ring-solie-green":
              variant === "primary",
            "bg-solie-beige text-solie-green hover:bg-solie-beige/90 focus:ring-solie-beige":
              variant === "secondary",
            "border-2 border-solie-green text-solie-green hover:bg-solie-green hover:text-white focus:ring-solie-green":
              variant === "outline",
            "bg-[#25D366] text-white hover:bg-[#128C7E] focus:ring-[#25D366]":
              variant === "whatsapp",
            // Sizes
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
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

export { Button };
