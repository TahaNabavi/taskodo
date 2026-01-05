"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

type Row = {
  tagId: string;
  label: string;
  scheduled: number;
  completed: number;
  completionRate: number;
  lateRate: number;
};

type Props = { rows: Row[] };

function pct(v: number) {
  return `${Math.round(v * 100)}%`;
}

export function TagEffectivenessTable({ rows }: Props) {
  const top = rows.slice(0, 10);

  return (
    <Card className="rounded-3xl bg-black/20 border-black">
      <CardHeader>
        <CardTitle className="text-white/80 text-lg">
          Tag Effectiveness
        </CardTitle>
        <p className="text-xs text-white/40 font-extralight">
          Completion and late rates for each category.
        </p>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="text-white/40 font-extralight">
            <tr className="border-b border-white/10">
              <th className="text-left py-2">Tag</th>
              <th className="text-right py-2">Scheduled</th>
              <th className="text-right py-2">Completed</th>
              <th className="text-right py-2">Completion</th>
              <th className="text-right py-2">Late</th>
            </tr>
          </thead>

          <tbody className="text-white/70 font-extralight">
            {top.map((r) => (
              <tr key={r.tagId} className="border-b border-white/5">
                <td className="py-2">{r.label}</td>
                <td className="py-2 text-right">{r.scheduled}</td>
                <td className="py-2 text-right">{r.completed}</td>
                <td className="py-2 text-right">{pct(r.completionRate)}</td>
                <td className="py-2 text-right">{pct(r.lateRate)}</td>
              </tr>
            ))}

            {top.length === 0 && (
              <tr>
                <td className="py-4 text-center text-white/40" colSpan={5}>
                  No tag data available yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
