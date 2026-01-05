"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import type { DayStats } from "../../lib/analytics";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Props = { dayStats: DayStats[] };

export function DailyTrendChart({ dayStats }: Props) {
  const data = dayStats.map((d) => ({
    date: d.dateKey.slice(5),
    completed: d.counts.completed,
    scheduled: d.counts.scheduled,
  }));

  return (
    <Card className="rounded-3xl bg-black/20 border-black">
      <CardHeader className="pb-2">
        <CardTitle className="text-white/80 text-sm">Daily Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeOpacity={0.1} />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="completed" strokeWidth={2} />
            <Line
              type="monotone"
              dataKey="scheduled"
              strokeWidth={1}
              opacity={0.5}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
