"use client";

import { format } from "date-fns";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/lib/utils";
import { RangeMode } from "@/src/utils";

type Props = {
  mode: RangeMode;
  setMode: (m: RangeMode) => void;

  cursor: Date;
  setCursor: (d: Date) => void;

  targetRate: number;
  setTargetRate: (r: number) => void;
};

const MODES: RangeMode[] = ["day", "week", "month"];

export function RangeControls({
  mode,
  setMode,
  cursor,
  setCursor,
  targetRate,
  setTargetRate,
}: Props) {
  function shift(days: number) {
    const x = new Date(cursor);
    x.setDate(x.getDate() + days);
    setCursor(x);
  }

  const label = format(cursor, "PPP");

  return (
    <Card className="rounded-3xl bg-black/20 border-black p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:justify-between">
        <div className="flex items-center gap-2">
          {MODES.map((m) => {
            const active = m === mode;
            return (
              <Button
                key={m}
                type="button"
                variant={active ? "default" : "outline"}
                className={cn(
                  "rounded-xl capitalize",
                  !active && "bg-transparent border-primary/30 text-white/60",
                )}
                onClick={() => setMode(m)}
              >
                {m}
              </Button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 justify-between md:justify-end">
          <Button
            variant="ghost"
            className="rounded-xl"
            onClick={() => shift(mode === "month" ? -30 : -1)}
          >
            Prev
          </Button>
          <div className="text-sm text-white/70 font-medium min-w-36 text-center">
            {label}
          </div>
          <Button
            variant="ghost"
            className="rounded-xl"
            onClick={() => shift(mode === "month" ? 30 : 1)}
          >
            Next
          </Button>

          <Button
            variant="secondary"
            className="rounded-xl"
            onClick={() => setCursor(new Date())}
          >
            Today
          </Button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-xs text-white/50">Target completion rate:</div>

        <div className="flex items-center gap-2">
          {[0.6, 0.7, 0.8, 0.9].map((v) => (
            <Button
              key={v}
              size="sm"
              variant={targetRate === v ? "default" : "outline"}
              className={cn(
                "rounded-xl",
                targetRate !== v &&
                  "bg-transparent border-white/10 text-white/50",
              )}
              onClick={() => setTargetRate(v)}
            >
              {(v * 100).toFixed(0)}%
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
