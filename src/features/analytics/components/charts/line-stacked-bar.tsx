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

export function LineStackedBar({ summary }: Props) {
  const data = [
    {
      name: "Lines",
      line1: summary.byLineCompleted[1],
      line2: summary.byLineCompleted[2],
      line3: summary.byLineCompleted[3],
    },
  ];

  return (
    <Card className="rounded-3xl bg-black/20 border-black">
      <CardHeader className="pb-2">
        <CardTitle className="text-white/80 text-sm">
          Completed by Line
        </CardTitle>
      </CardHeader>
      <CardContent className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeOpacity={0.1} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar
              dataKey="line1"
              stackId="a"
              radius={[8, 8, 0, 0]}
              fill="skyblue"
            />
            <Bar
              dataKey="line2"
              stackId="a"
              radius={[0, 0, 0, 0]}
              fill="orange"
            />
            <Bar dataKey="line3" stackId="a" radius={[0, 0, 8, 8]} fill="red" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
