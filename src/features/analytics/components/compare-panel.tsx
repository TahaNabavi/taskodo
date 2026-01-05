"use client";

import type { CompareStats } from "../lib/analytics";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { RangeMode } from "@/src/utils";

type Props = {
  mode: RangeMode;
  compare: CompareStats;
};

function deltaLabel(v: number, isPct = false) {
  if (isPct) return `${v >= 0 ? "+" : ""}${Math.round(v * 100)}%`;
  return `${v >= 0 ? "+" : ""}${v}`;
}

export function ComparePanel({ mode, compare }: Props) {
  const title =
    mode === "day"
      ? "vs Yesterday"
      : mode === "week"
        ? "vs Last Week"
        : "vs Last Month";

  return (
    <Card className="rounded-3xl bg-black/20 border-black">
      <CardHeader className="pb-2">
        <CardTitle className="text-white/80 text-sm">Comparison</CardTitle>
        <p className="text-xs text-white/40 font-extralight">{title}</p>
      </CardHeader>

      <CardContent className="space-y-2 text-xs font-extralight text-white/70">
        <div className="flex justify-between">
          <span>Scheduled</span>
          <span
            className={cn(
              compare.scheduledDelta >= 0 ? "text-white/80" : "text-red-200",
            )}
          >
            {deltaLabel(compare.scheduledDelta)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Completed</span>
          <span
            className={cn(
              compare.completedDelta >= 0 ? "text-green-200" : "text-red-200",
            )}
          >
            {deltaLabel(compare.completedDelta)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Completion rate</span>
          <span
            className={cn(
              compare.completionRateDelta >= 0
                ? "text-green-200"
                : "text-red-200",
            )}
          >
            {deltaLabel(compare.completionRateDelta, true)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Late rate</span>
          <span
            className={cn(
              compare.lateRateDelta <= 0 ? "text-green-200" : "text-red-200",
            )}
          >
            {deltaLabel(compare.lateRateDelta, true)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Streak</span>
          <span
            className={cn(
              compare.streakDelta >= 0 ? "text-green-200" : "text-red-200",
            )}
          >
            {deltaLabel(compare.streakDelta)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
