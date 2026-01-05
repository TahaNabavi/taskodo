"use client";

import { motion } from "motion/react";
import { cn } from "@/src/lib/utils";

type Line = 1 | 2 | 3;

type Props = {
  activeLine: Line;
  setActiveLine: (line: Line) => void;
  counts?: Record<Line, number>;
};

const LINES: { value: Line; label: string }[] = [
  { value: 1, label: "Line 1" },
  { value: 2, label: "Line 2" },
  { value: 3, label: "Line 3" },
];

export function MobileLineTabs({ activeLine, setActiveLine, counts }: Props) {
  return (
    <div
      data-tour="mb:lines-board"
      className="relative flex w-full overflow-hidden rounded-2xl bg-white/5"
    >
      {LINES.map((l) => {
        const isActive = l.value === activeLine;
        const count = counts?.[l.value] ?? 0;

        return (
          <button
            key={l.value}
            onClick={() => setActiveLine(l.value)}
            className="relative flex-1 py-3 text-center"
          >
            {isActive && (
              <motion.div
                layoutId="mobile-active-line"
                className="absolute inset-0 bg-white/10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}

            <span
              className={cn(
                "relative z-10 flex items-center justify-center gap-2 text-sm font-medium transition-colors",
                isActive ? "text-white/90" : "text-white/50",
              )}
            >
              <span>{l.label}</span>

              <span
                className={cn(
                  "min-w-6 px-1.5 py-0.5 rounded-full text-[11px] font-semibold",
                  isActive
                    ? "bg-primary/25 text-primary"
                    : "bg-white/10 text-white/40",
                )}
              >
                {count}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
