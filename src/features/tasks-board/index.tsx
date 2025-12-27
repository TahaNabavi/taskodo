"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { EraserAddIcon } from "@hugeicons/core-free-icons";

import { GooeySvgFilter } from "@/src/components/fancy";
import { cn } from "@/src/lib/utils";

import { TAB_CONTENT } from "./constants";
import { TaskLinesBoard } from "./components/task-lines-board";
import { CreateTaskTab } from "./components/create-task-tab";

export function TasksBoardFeature() {
  const todayIndex = new Date().getDay() % 7;
  const [activeTab, setActiveTab] = useState<number>(todayIndex);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActiveTab((p) => (p >= 6 ? 6 : p + 1));
      if (e.key === "ArrowLeft") setActiveTab((p) => (p <= -1 ? -1 : p - 1));
      if (e.key === "+") setActiveTab(-1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative w-dvw h-dvh flex justify-center p-8 font-calendas md:text-base text-xs sm:text-sm">
      <GooeySvgFilter id="gooey-filter" strength={20} />

      <div className="w-11/12 md:w-4/5 relative mt-16">
        <div
          className="absolute inset-0"
          style={{ filter: "url(#gooey-filter)" }}
        >
          <div className="flex w-full">
            <div className="relative w-30 h-8 md:h-12">
              {activeTab === -1 && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-zinc-900/95 shadow-[inset_0_-4px_15px_rgba(0,0,0,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </div>

            {TAB_CONTENT.map((_, index) => (
              <div key={index} className="relative flex-1 h-8 md:h-12">
                {activeTab === index && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-zinc-900/95 shadow-[inset_0_-4px_15px_rgba(0,0,0,0.4)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="w-full bg-zinc-900/95 text-muted-foreground shadow-[inset_0_10px_15px_rgba(0,0,0,0.4)] p-6">
            {activeTab === -1 ? (
              <CreateTaskTab />
            ) : (
              <TaskLinesBoard activeDay={TAB_CONTENT[activeTab].title} />
            )}
          </div>
        </div>

        <div className="relative flex w-full">
          <button
            onClick={() => setActiveTab(-1)}
            className="w-30 flex items-center justify-center gap-3 h-8 md:h-12 cursor-pointer group/btn"
          >
            <span
              className={cn(
                "first-letter:uppercase transition-colors",
                activeTab === -1
                  ? "text-primary"
                  : "text-white/50 group-hover/btn:text-primary group-hover/btn:text-shadow-primary/20 group-hover/btn:text-shadow-sm",
              )}
            >
              <HugeiconsIcon icon={EraserAddIcon} strokeWidth={2.5} />
            </span>
          </button>

          {TAB_CONTENT.map((tab, index) => {
            const isToday = index === todayIndex;

            return (
              <button
                key={tab.title}
                onClick={() => setActiveTab(index)}
                className="flex-1 flex items-center justify-center gap-3 h-8 md:h-12 cursor-pointer group/btn"
              >
                {isToday && (
                  <div>
                    <span className="relative inline-flex">
                      <span
                        className={cn(
                          "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                          activeTab === index ? "bg-primary/80" : "bg-white/20",
                        )}
                      />
                      <span
                        className={cn(
                          "relative inline-flex h-3 w-3 rounded-full",
                          activeTab === index
                            ? "bg-primary/80"
                            : "bg-primary/30",
                        )}
                      />
                    </span>
                  </div>
                )}

                <span
                  className={cn(
                    "first-letter:uppercase transition-colors",
                    activeTab === index
                      ? "text-white/80"
                      : "text-white/50 group-hover/btn:text-primary group-hover/btn:text-shadow-primary/20 group-hover/btn:text-shadow-sm",
                  )}
                >
                  {tab.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
