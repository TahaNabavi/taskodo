"use client";

import type { ForecastStats } from "../lib/analytics";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

type Props = { forecast: ForecastStats };

export function ForecastPanel({ forecast }: Props) {
  return (
    <Card className="rounded-3xl bg-black/20 border-black">
      <CardHeader className="pb-2">
        <CardTitle className="text-white/80 text-sm">
          Next Week Forecast
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 text-xs font-extralight text-white/70">
        <div className="flex justify-between">
          <span>Total scheduled</span>
          <span className="text-white/80">{forecast.scheduledTotal}</span>
        </div>

        <div className="flex justify-between">
          <span>Expected pace</span>
          <span className="text-white/80">
            {forecast.expectedPerDay.toFixed(1)}/day
          </span>
        </div>

        <div className="flex justify-between">
          <span>Busiest day</span>
          <span className="text-white/80">
            {forecast.busiestDay
              ? `${forecast.busiestDay.dateKey} (${forecast.busiestDay.scheduled})`
              : "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Heaviest line</span>
          <span className="text-white/80">
            {forecast.heaviestLine
              ? `Line ${forecast.heaviestLine.line} (${forecast.heaviestLine.scheduled})`
              : "-"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
