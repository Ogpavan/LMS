import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-[15px] font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 aria-invalid:ring-red-400 aria-invalid:border-red-400 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#f5f5f7] to-[#e5e5ea] text-[#1c1c1e] shadow hover:from-[#e5e5ea] hover:to-[#f5f5f7] active:from-[#d1d1d6] active:to-[#e5e5ea] border border-[#d1d1d6]",
        destructive:
          "bg-gradient-to-b from-[#ff3b30] to-[#ff453a] text-white shadow hover:from-[#ff453a] hover:to-[#ff3b30] active:from-[#c1271a] active:to-[#ff453a] border border-[#ff453a]",
        outline:
          "bg-transparent border border-[#d1d1d6] text-[#1c1c1e] hover:bg-[#f2f2f7] active:bg-[#e5e5ea]",
        secondary:
          "bg-gradient-to-b from-[#f2f2f7] to-[#e5e5ea] text-[#1c1c1e] shadow hover:from-[#e5e5ea] hover:to-[#f2f2f7] active:from-[#d1d1d6] active:to-[#e5e5ea] border border-[#d1d1d6]",
        ghost:
          "bg-transparent text-[#1c1c1e] hover:bg-[#f2f2f7] active:bg-[#e5e5ea]",
        link: "text-[#007aff] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-[6px] px-3",
        lg: "h-12 rounded-[10px] px-7",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
