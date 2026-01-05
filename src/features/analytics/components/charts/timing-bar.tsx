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
  XAxis,
  CartesianGrid,
} from "recharts";

type Props = { summary: SummaryStats };

export function TimingBarChart({ summary }: Props) {
  const data = [
    { name: "Early", value: summary.timing.early },
    { name: "On time", value: summary.timing.onTime },
    { name: "Late", value: summary.timing.late },
  ];

  return (
    <Card className="rounded-3xl bg-black/20 border-black">
      <CardHeader className="pb-2">
        <CardTitle className="text-white/80 text-sm">Timing</CardTitle>
      </CardHeader>
      <CardContent className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeOpacity={0.1} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="var(--color-primary)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
