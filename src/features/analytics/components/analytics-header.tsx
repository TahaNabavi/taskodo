"use client";

import { PATHS } from "@/src/routes/paths";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";

export function AnalyticsHeader() {
  const router = useRouter();

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-semibold text-white/90">
          Analytics
        </h1>
        <Button variant="secondary" onClick={() => router.push(PATHS.HOME)}>
          Back
        </Button>
      </div>
      <p className="text-sm text-white/50 font-extralight">
        Insights about your productivity, workload, streaks, and catch-up needs.
      </p>
    </div>
  );
}
