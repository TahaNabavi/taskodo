"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import type { SummaryStats } from "../lib/analytics";

type Props = { summary: SummaryStats };

function pct(v: number) {
  return `${Math.round(v * 100)}%`;
}

export function SummaryCards({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card className="rounded-3xl bg-black/20 border-black">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-white/50 font-extralight">
            Scheduled
          </CardTitle>
        </CardHeader>
        <CardContent className="text-white/90 text-xl font-semibold">
          {summary.scheduledTotal}
        </CardContent>
      </Card>

      <Card className="rounded-3xl bg-black/20 border-black">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-white/50 font-extralight">
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent className="text-white/90 text-xl font-semibold">
          {summary.completedTotal}
        </CardContent>
      </Card>

      <Card className="rounded-3xl bg-black/20 border-black">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-white/50 font-extralight">
            Completion Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="text-white/90 text-xl font-semibold">
          {pct(summary.completionRate)}
        </CardContent>
      </Card>

      <Card className="rounded-3xl bg-black/20 border-black">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-white/50 font-extralight">
            Current Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="text-white/90 text-xl font-semibold">
          {summary.streak.current} days
        </CardContent>
      </Card>
    </div>
  );
}
