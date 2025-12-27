import { cn } from "@/src/lib/utils";
import { useState } from "react";

export const DOT = {
  slate: {
    base: "bg-slate-400",
    hover: "bg-slate-300",
    shadow: "shadow-slate-300/50",
    pulse: "bg-slate-200",
  },
  gray: {
    base: "bg-gray-400",
    hover: "bg-gray-300",
    shadow: "shadow-gray-300/50",
    pulse: "bg-gray-200",
  },
  zinc: {
    base: "bg-zinc-400",
    hover: "bg-zinc-300",
    shadow: "shadow-zinc-300/50",
    pulse: "bg-zinc-200",
  },
  neutral: {
    base: "bg-neutral-400",
    hover: "bg-neutral-300",
    shadow: "shadow-neutral-300/50",
    pulse: "bg-neutral-200",
  },
  stone: {
    base: "bg-stone-400",
    hover: "bg-stone-300",
    shadow: "shadow-stone-300/50",
    pulse: "bg-stone-200",
  },

  red: {
    base: "bg-red-400",
    hover: "bg-red-300",
    shadow: "shadow-red-300/50",
    pulse: "bg-red-200",
  },
  orange: {
    base: "bg-orange-400",
    hover: "bg-orange-300",
    shadow: "shadow-orange-300/50",
    pulse: "bg-orange-200",
  },
  amber: {
    base: "bg-amber-400",
    hover: "bg-amber-300",
    shadow: "shadow-amber-300/50",
    pulse: "bg-amber-200",
  },
  yellow: {
    base: "bg-yellow-400",
    hover: "bg-yellow-300",
    shadow: "shadow-yellow-300/50",
    pulse: "bg-yellow-200",
  },
  lime: {
    base: "bg-lime-400",
    hover: "bg-lime-300",
    shadow: "shadow-lime-300/50",
    pulse: "bg-lime-200",
  },
  green: {
    base: "bg-green-400",
    hover: "bg-green-300",
    shadow: "shadow-green-300/50",
    pulse: "bg-green-200",
  },
  emerald: {
    base: "bg-emerald-400",
    hover: "bg-emerald-300",
    shadow: "shadow-emerald-300/50",
    pulse: "bg-emerald-200",
  },
  teal: {
    base: "bg-teal-400",
    hover: "bg-teal-300",
    shadow: "shadow-teal-300/50",
    pulse: "bg-teal-200",
  },
  cyan: {
    base: "bg-cyan-400",
    hover: "bg-cyan-300",
    shadow: "shadow-cyan-300/50",
    pulse: "bg-cyan-200",
  },
  sky: {
    base: "bg-sky-400",
    hover: "bg-sky-300",
    shadow: "shadow-sky-300/50",
    pulse: "bg-sky-200",
  },
  blue: {
    base: "bg-blue-400",
    hover: "bg-blue-300",
    shadow: "shadow-blue-300/50",
    pulse: "bg-blue-200",
  },
  indigo: {
    base: "bg-indigo-400",
    hover: "bg-indigo-300",
    shadow: "shadow-indigo-300/50",
    pulse: "bg-indigo-200",
  },
  violet: {
    base: "bg-violet-400",
    hover: "bg-violet-300",
    shadow: "shadow-violet-300/50",
    pulse: "bg-violet-200",
  },
  purple: {
    base: "bg-purple-400",
    hover: "bg-purple-300",
    shadow: "shadow-purple-300/50",
    pulse: "bg-purple-200",
  },
  fuchsia: {
    base: "bg-fuchsia-400",
    hover: "bg-fuchsia-300",
    shadow: "shadow-fuchsia-300/50",
    pulse: "bg-fuchsia-200",
  },
  pink: {
    base: "bg-pink-400",
    hover: "bg-pink-300",
    shadow: "shadow-pink-300/50",
    pulse: "bg-pink-200",
  },
  rose: {
    base: "bg-rose-400",
    hover: "bg-rose-300",
    shadow: "shadow-rose-300/50",
    pulse: "bg-rose-200",
  },
} as const;

export type LiveButtonColor = keyof typeof DOT;

interface LiveButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler;
  color?: LiveButtonColor;
  className?: string;
  disableMotion?: boolean;
}

export function LiveButton({
  children,
  onClick,
  color = "cyan",
  className = "",
  disableMotion = false,
  onDoubleClick,
}: LiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const c = DOT[color];

  return (
    <div
      className={cn(
        "group relative flex items-center justify-center gap-3 overflow-hidden rounded-lg border border-gray-300 bg-white px-6",
        disableMotion
          ? "transition-none"
          : "transition-all duration-500 ease-out hover:border-gray-400 hover:shadow-lg hover:shadow-black/20 hover:scale-105",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-black/5 before:to-transparent",
        disableMotion
          ? "before:transition-none"
          : "before:transition-transform before:duration-700 hover:before:translate-x-full",
        "dark:border-gray-600 dark:bg-black dark:before:via-white/5 dark:hover:border-gray-500 dark:hover:shadow-white/20",
        className,
      )}
      onMouseEnter={() => !disableMotion && setIsHovered(true)}
      onMouseLeave={() => {
        if (disableMotion) return;
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => !disableMotion && setIsPressed(true)}
      onMouseUp={() => !disableMotion && setIsPressed(false)}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="absolute inset-0 rounded-lg bg-linear-to-r from-cyan-200/0 via-cyan-200/10 to-cyan-200/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-cyan-200/0 dark:via-cyan-200/10 dark:to-cyan-200/0" />

      <span className="relative w-full z-10 text-sm font-medium tracking-wide whitespace-nowrap text-black transition-all duration-300 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-50 p-4">
        {children}
      </span>

      <span
        className={cn(
          "relative z-10 h-3 w-3 rounded-full transition-all duration-500 ease-out",
          c.base,
          !disableMotion &&
            isHovered && ["scale-125", c.hover, "shadow-lg", c.shadow],
          !disableMotion && isPressed && "scale-90",
          "before:absolute before:inset-0 before:animate-pulse before:rounded-full before:opacity-0 group-hover:before:opacity-50",
          // pulse color is applied to a real element instead of `before:` (Tailwind can't do dynamic `before:bg-*`)
        )}
      >
        {/* pulse layer */}
        <span
          className={cn(
            "absolute inset-0 rounded-full opacity-0 group-hover:opacity-50",
            c.pulse,
          )}
        />

        {/* ping layer */}
        <span
          className={cn(
            "absolute inset-0 animate-ping rounded-full opacity-0 group-hover:opacity-60",
            c.base,
          )}
          style={{ animationDuration: "2s" }}
        />
      </span>

      <div className="absolute inset-0 animate-pulse rounded-lg border-2 border-cyan-200/0 opacity-0 transition-all duration-500 group-hover:border-cyan-500/30 group-hover:opacity-100 dark:group-hover:border-cyan-200/30" />
    </div>
  );
}
