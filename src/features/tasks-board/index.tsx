"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add02Icon,
  ArrowDown01Icon,
  ArrowTurnBackwardIcon,
  ArrowUp01Icon,
} from "@hugeicons/core-free-icons";

import { GooeySvgFilter } from "@/src/components/fancy";
import { cn } from "@/src/lib/utils";

import { TAB_CONTENT } from "./constants";
import { TaskLinesBoard } from "./components/task-lines-board";
import { CreateTaskTab } from "./components/create-task-tab";
import { Button } from "@/src/components/ui";

function startOfWeekSunday(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  x.setDate(x.getDate() - day);
  return x;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

export function TasksBoardFeature() {
  const [weekOffset, setWeekOffset] = useState(0);

  const todayIndex = new Date().getDay() % 7;
  const [activeTab, setActiveTab] = useState<number>(todayIndex);

  const { weekStart, weekEnd } = useMemo(() => {
    const base = new Date();
    const start = startOfWeekSunday(addDays(base, weekOffset * 7));
    const end = addDays(start, 6);
    return { weekStart: start, weekEnd: end };
  }, [weekOffset]);

  const viewIndex = useMemo(() => {
    return weekOffset === 0 ? todayIndex : -999;
  }, [weekOffset, todayIndex]);

  const weekStartDayOfMonth = weekStart.getDate();
  const weekEndDayOfMonth = weekEnd.getDate();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Tabs
      if (e.key === "ArrowRight") setActiveTab((p) => (p >= 6 ? -1 : p + 1));
      if (e.key === "ArrowLeft") setActiveTab((p) => (p <= -1 ? 6 : p - 1));
      if (e.key === "+") setActiveTab(-1);

      // Week navigation
      if (e.key === "ArrowUp") setWeekOffset((w) => w + 1);
      if (e.key === "ArrowDown") setWeekOffset((w) => w - 1);
      if (e.key === "Home") setWeekOffset(0);
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
          {/* Week widget */}
          <div
            className={cn(
              "w-12 bg-zinc-900/95 absolute top-24 -right-12 flex flex-col items-center justify-center transition-all py-4 gap-1",
              activeTab === -1 && "dark:text-white/30",
            )}
          >
            <div className="w-8 bg-white/10 rounded-full flex flex-col justify-between items-center py-1 gap-3">
              <Button
                variant="ghost"
                className="px-1 rounded-full delay-100"
                onClick={() => setWeekOffset((w) => w + 1)}
                aria-label="Next week"
                disabled
              >
                <HugeiconsIcon icon={ArrowUp01Icon} />
              </Button>

              <span className="text-xs font-extralight">
                {weekEndDayOfMonth}
              </span>
              <span className="text-xs">-</span>
              <span className="text-xs font-extralight">
                {weekStartDayOfMonth}
              </span>

              <Button
                variant="ghost"
                className="px-1 rounded-full delay-100"
                onClick={() => setWeekOffset((w) => w - 1)}
                aria-label="Previous week"
                disabled={activeTab === -1}
              >
                <HugeiconsIcon icon={ArrowDown01Icon} />
              </Button>
            </div>
            <AnimatePresence mode="popLayout">
              {weekOffset !== 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                >
                  <Button
                    variant="ghost"
                    className="px-2 rounded-full delay-100"
                    onClick={() => setWeekOffset(0)}
                    aria-label="Previous week"
                  >
                    <HugeiconsIcon icon={ArrowTurnBackwardIcon} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab header highlight */}
          <div className="flex w-full">
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

            <div className="relative w-30 h-8 md:h-12">
              {activeTab === -1 && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-zinc-900/95 shadow-[inset_0_-4px_15px_rgba(0,0,0,0.4)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="w-full bg-zinc-900/95 text-muted-foreground shadow-[inset_0_10px_15px_rgba(0,0,0,0.4)] p-6">
            {activeTab === -1 ? (
              <CreateTaskTab />
            ) : (
              <TaskLinesBoard
                activeDay={TAB_CONTENT[activeTab].title}
                weekStart={weekStart}
              />
            )}
          </div>
        </div>

        {/* Tab buttons */}
        <div className="relative flex w-full">
          {TAB_CONTENT.map((tab, index) => {
            const isToday = index === viewIndex;

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
              <HugeiconsIcon
                icon={Add02Icon}
                fill="currentColor"
                strokeWidth={2.5}
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
