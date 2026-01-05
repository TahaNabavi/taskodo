"use client";

import { useCallback } from "react";
import type { SummaryStats } from "../lib/analytics";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

type Props = {
  reportText: string;
  summary: SummaryStats;
};

export function ExportPanel({ reportText, summary }: Props) {
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(reportText);
  }, [reportText]);

  const download = useCallback(() => {
    const payload = JSON.stringify(summary, null, 2);
    const blob = new Blob([payload], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "taskodo-analytics.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [summary]);

  return (
    <Card className="rounded-3xl bg-black/20 border-black">
      <CardHeader className="pb-2">
        <CardTitle className="text-white/80 text-sm">Export</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-xs text-white/50 font-extralight">
          Copy a shareable report or export raw analytics as JSON.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={copy} className="rounded-xl" variant="secondary">
            Copy report
          </Button>
          <Button onClick={download} className="rounded-xl" variant="outline">
            Download JSON
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
