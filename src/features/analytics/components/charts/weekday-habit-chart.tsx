"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
} from "recharts";

type Row = {
  day: string;
  scheduled: number;
  completed: number;
  completionRate: number;
};

type Props = { data: Row[] };

const DAY_LABEL: Record<string, string> = {
  sunday: "Sun",
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
};

export function WeekdayHabitChart({ data }: Props) {
  const chart = data.map((d) => ({
    day: DAY_LABEL[d.day] ?? d.day.slice(0, 3),
    completion: Math.round(d.completionRate * 100),
  }));

  return (
    <Card className="rounded-3xl bg-black/20 border-black md:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-white/80 text-sm">
          Habit Consistency (All History)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chart}>
            <CartesianGrid strokeOpacity={0.1} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
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
