"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import type { SummaryStats } from "../../lib/analytics";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Props = { summary: SummaryStats };

export function CompletionDonut({ summary }: Props) {
  const data = [
    {
      name: "Completed",
      value: summary.completedTotal,
      color: "green",
    },
    {
      name: "Unfinished",
      value: summary.unfinishedTotal,
      color: "red",
    },
  ];

  return (
    <Card className="rounded-3xl bg-black/20 border-black">
      <CardHeader className="pb-2">
        <CardTitle className="text-white/80 text-sm">
          Completion Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={45}
              outerRadius={70}
              dataKey="value"
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={data[index].color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
