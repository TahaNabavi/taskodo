"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import type { SummaryStats } from "../lib/analytics";
import { cn } from "@/src/lib/utils";

type Props = { summary: SummaryStats };

function healthLabel(h: SummaryStats["health"]) {
  if (h === "light") return "Light";
  if (h === "balanced") return "Balanced";
  if (h === "heavy") return "Heavy";
  return "Overloaded";
}

export function ScoreCard({ summary }: Props) {
  const completion = Math.round(summary.completionRate * 100);
  const late = Math.round(summary.timing.lateRate * 100);

  return (
    <Card className="rounded-3xl bg-black/20 border-black">
      <CardHeader className="pb-2">
        <CardTitle className="text-white/80 text-sm">
          Productivity Score
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div className="text-4xl font-semibold text-white/90">
            {summary.score}
            <span className="text-sm text-white/40 font-extralight">/100</span>
          </div>

          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full border",
              summary.health === "balanced" &&
                "border-green-500/20 bg-green-500/10 text-green-200",
              summary.health === "light" &&
                "border-white/10 bg-white/5 text-white/70",
              summary.health === "heavy" &&
                "border-yellow-500/20 bg-yellow-500/10 text-yellow-200",
              summary.health === "overloaded" &&
                "border-red-500/20 bg-red-500/10 text-red-200",
            )}
          >
            {healthLabel(summary.health)}
          </span>
        </div>

        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-primary/80 rounded-full transition-all"
            style={{ width: `${summary.score}%` }}
          />
        </div>

        <div className="text-xs text-white/50 font-extralight space-y-1">
          <div>Completion: {completion}%</div>
          <div>Late rate: {late}%</div>
          <div>
            Consistency (std dev): {summary.consistencyStdDev.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
