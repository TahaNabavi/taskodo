"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick04Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ArrowTurnBackwardIcon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/src/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { TAB_CONTENT } from "../constants";

type Props = {
  trigger: ReactNode;
  activeDayIndex: number;
  setActiveDayIndex: (idx: number) => void;
  stats: { total: number; done: number }[];
  weekOffset: number;
  setWeekOffset: Dispatch<SetStateAction<number>>;
  weekStart: Date;
  weekEnd: Date;
};

export function MobileDayPickerDialog({
  trigger,
  activeDayIndex,
  setActiveDayIndex,
  stats,
  weekOffset,
  setWeekOffset,
  weekStart,
  weekEnd,
}: Props) {
  const todayIndex = new Date().getDay() % 7;

  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Week</DialogTitle>
        </DialogHeader>

        <div className="rounded-2xl border border-border bg-card p-3">
          <div className="flex items-center justify-between">
            <Button
              size="icon"
              variant="ghost"
              className="rounded-xl"
              onClick={() => setWeekOffset((w) => w + 1)}
            >
              <HugeiconsIcon icon={ArrowUp01Icon} />
            </Button>

            <div className="text-center">
              <div className="text-sm font-medium text-foreground">
                {weekStart.getDate()} - {weekEnd.getDate()}
              </div>
              <div className="text-xs text-muted-foreground">
                {weekStart.toLocaleDateString()} →{" "}
                {weekEnd.toLocaleDateString()}
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="rounded-xl"
              onClick={() => setWeekOffset((w) => w - 1)}
            >
              <HugeiconsIcon icon={ArrowDown01Icon} />
            </Button>
          </div>

          {weekOffset !== 0 && (
            <div className="mt-3 flex justify-center">
              <Button
                variant="secondary"
                className="rounded-xl"
                onClick={() => setWeekOffset(0)}
              >
                <HugeiconsIcon icon={ArrowTurnBackwardIcon} />
                <span className="ml-2">Reset to this week</span>
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {TAB_CONTENT.map((d, i) => {
            const dayStats = stats[i];
            const isActive = i === activeDayIndex;
            const isToday = i === todayIndex;

            const pct =
              dayStats.total === 0
                ? 0
                : Math.round((dayStats.done / dayStats.total) * 100);

            return (
              <button
                key={d.title}
                onClick={() => setActiveDayIndex(i)}
                className={cn(
                  "w-full rounded-2xl border p-3 flex items-center justify-between gap-3 transition-colors",
                  isActive
                    ? "border-primary/40 bg-primary/10"
                    : "border-border bg-card hover:bg-accent",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 flex justify-center">
                    {isToday && (
                      <span className="relative inline-flex">
                        <span
                          className={cn(
                            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                            isActive ? "bg-primary/80" : "bg-white/20",
                          )}
                        />
                        <span
                          className={cn(
                            "relative inline-flex h-3 w-3 rounded-full",
                            isActive ? "bg-primary/80" : "bg-primary/30",
                          )}
                        />
                      </span>
                    )}
                  </div>

                  <div className="w-14 text-left capitalize font-medium">
                    {d.title.slice(0, 3)}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {dayStats.done}/{dayStats.total} done • {pct}%
                  </div>
                </div>

                {isActive && (
                  <HugeiconsIcon icon={Tick04Icon} className="text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
