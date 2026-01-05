"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import type { SummaryStats } from "../../lib/analytics";

import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
} from "recharts";

type Props = { summary: SummaryStats };

export function TagCompletionChart({ summary }: Props) {
  const data = summary.byTag.slice(0, 8).map((t) => ({
    name: t.label,
    completion: Math.round(t.completionRate * 100),
  }));

  return (
    <Card className="rounded-3xl bg-black/20 border-black md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-white/80 text-sm">
          Tag Completion Rate
        </CardTitle>
      </CardHeader>
      <CardContent className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeOpacity={0.1} />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
            <Tooltip />
            <Bar
              dataKey="completion"
              radius={[8, 8, 0, 0]}
              fill="var(--color-primary)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
