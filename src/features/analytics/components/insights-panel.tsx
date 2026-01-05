"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import type { Insight, SummaryStats } from "../lib/analytics";
import { cn } from "@/src/lib/utils";

type Props = {
  insights: Insight[];
  summary: SummaryStats;
};

export function InsightsPanel({ insights, summary }: Props) {
  return (
    <Card className="rounded-3xl bg-black/20 border-black h-fit">
      <CardHeader>
        <CardTitle className="text-white/80 text-lg">Suggestions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-3">
          <div className="text-xs text-white/50 mb-1">Catch-up</div>
          {summary.compensation.remainingToTarget > 0 ? (
            <div className="text-sm text-white/80">
              Finish{" "}
              <span className="text-primary font-semibold">
                {summary.compensation.requiredPerDay.toFixed(1)}
              </span>{" "}
              tasks/day to reach{" "}
              <span className="text-primary font-semibold">
                {(summary.compensation.targetRate * 100).toFixed(0)}%
              </span>{" "}
              completion.
            </div>
          ) : (
            <div className="text-sm text-white/70">
              You’re on track for your target completion rate.
            </div>
          )}
        </div>

        {insights.map((i, idx) => (
          <div
            key={idx}
            className={cn(
              "rounded-2xl border p-3",
              i.type === "warn" && "border-red-500/20 bg-red-500/10",
              i.type === "success" && "border-green-500/20 bg-green-500/10",
              i.type === "info" && "border-white/5 bg-white/5",
            )}
          >
            <div className="text-sm font-semibold text-white/90">{i.title}</div>
            <div className="text-xs text-white/60 mt-1 font-extralight">
              {i.detail}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
