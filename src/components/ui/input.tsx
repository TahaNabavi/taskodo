import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/src/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // layout
        "flex h-9 w-full min-w-0 rounded-md px-2.5 py-1 text-base md:text-sm",
        "bg-transparent shadow-xs outline-none transition-[color,box-shadow,border-color,background-color]",

        // border + colors (align with button outline)
        "border border-input text-foreground placeholder:text-muted-foreground",
        "dark:bg-neutral-800 dark:text-white/80 border-white/20",

        // focus (align with button base)
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",

        // invalid (align with button base)
        "aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20",
        "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",

        // disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

        // file input styling (same strategy as shadcn)
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground file:h-7 file:inline-flex",
        className
      )}
      {...props}
    />
  );
}

export { Input };
