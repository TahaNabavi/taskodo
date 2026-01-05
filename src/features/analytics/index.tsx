"use client";

import { useMemo, useState } from "react";
import { useTasksStore } from "@/src/features/tasks-board/stores/task.store";

import {
  addDays,
  endOfMonth,
  startOfMonth,
  startOfWeekSunday,
  toLocalDateKey,
  RangeMode,
} from "@/src/utils";
import { Separator } from "@/src/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import type { AnalyticsFilters } from "./lib/analytics";
import {
  buildDayStats,
  buildInsights,
  buildRange,
  buildShareableReport,
  computeCompare,
  computeForecast,
  computeSummary,
  computeWeekdayHabitConsistency,
} from "./lib/analytics";

import { AnalyticsHeader } from "./components/analytics-header";
import { RangeControls } from "./components/range-controls";
import { SummaryCards } from "./components/summary-cards";
import { ScoreCard } from "./components/score-card";
import { InsightsPanel } from "./components/insights-panel";
import { ComparePanel } from "./components/compare-panel";
import { ForecastPanel } from "./components/forecast-panel";
import { ExportPanel } from "./components/export-panel";
import { FiltersBar } from "./components/filters-bar";
import { TagEffectivenessTable } from "./components/tag-effectiveness-table";

import { DailyTrendChart } from "./components/charts/daily-trend-chart";
import { CompletionDonut } from "./components/charts/completion-donut";
import { TimingBarChart } from "./components/charts/timing-bar";
import { LineStackedBar } from "./components/charts/line-stacked-bar";
import { TagCompletionChart } from "./components/charts/tag-completion-chart";
import { WeekdayHabitChart } from "./components/charts/weekday-habit-chart";

export function AnalyticsPage() {
  const tasks = useTasksStore((s) => s.tasks);

  const [mode, setMode] = useState<RangeMode>("week");
  const [cursor, setCursor] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [targetRate, setTargetRate] = useState(0.8);

  const [filters, setFilters] = useState<AnalyticsFilters>({
    line: undefined,
    tagId: undefined,
    completedOnly: false,
  });

  const todayKey = useMemo(() => toLocalDateKey(new Date()), []);

  const range = useMemo(() => {
    const base = new Date(cursor);
    base.setHours(0, 0, 0, 0);

    if (mode === "day") return buildRange(base, base);

    if (mode === "week") {
      const start = startOfWeekSunday(base);
      const end = addDays(start, 6);
      return buildRange(start, end);
    }

    if (mode === "month") {
      const start = startOfMonth(base);
      const end = endOfMonth(base);
      return buildRange(start, end);
    }

    return buildRange(base, base);
  }, [mode, cursor]);

  const prevRange = useMemo(() => {
    if (mode === "day") {
      const prev = addDays(range.from, -1);
      return buildRange(prev, prev);
    }
    if (mode === "week") {
      const prevStart = addDays(range.from, -7);
      const prevEnd = addDays(prevStart, 6);
      return buildRange(prevStart, prevEnd);
    }
    if (mode === "month") {
      const prev = new Date(range.from);
      prev.setMonth(prev.getMonth() - 1);
      const start = startOfMonth(prev);
      const end = endOfMonth(prev);
      return buildRange(start, end);
    }
    return range;
  }, [mode, range]);

  const dayStats = useMemo(
    () => buildDayStats(tasks, range, filters),
    [tasks, range, filters],
  );

  const prevDayStats = useMemo(
    () => buildDayStats(tasks, prevRange, filters),
    [tasks, prevRange, filters],
  );

  const summary = useMemo(
    () => computeSummary(dayStats, { targetRate, todayKey }),
    [dayStats, targetRate, todayKey],
  );

  const prevSummary = useMemo(
    () => computeSummary(prevDayStats, { targetRate, todayKey }),
    [prevDayStats, targetRate, todayKey],
  );

  const compare = useMemo(
    () => computeCompare(summary, prevSummary),
    [summary, prevSummary],
  );

  const insights = useMemo(() => buildInsights(summary), [summary]);

  const forecast = useMemo(() => computeForecast(tasks, new Date()), [tasks]);

  const weekdayHabit = useMemo(
    () => computeWeekdayHabitConsistency(tasks),
    [tasks],
  );

  const reportText = useMemo(() => buildShareableReport(summary), [summary]);

  const isEmpty = summary.scheduledTotal === 0;

  return (
    <div className="min-h-dvh w-full px-4 md:px-8 py-10">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <AnalyticsHeader />

        <div data-tour="range-controls">
          <RangeControls
            mode={mode}
            setMode={setMode}
            cursor={cursor}
            setCursor={setCursor}
            targetRate={targetRate}
            setTargetRate={setTargetRate}
          />
        </div>

        <div data-tour="filters-bar">
          <FiltersBar tasks={tasks} filters={filters} setFilters={setFilters} />
        </div>

        <Separator className="opacity-20" />

        {isEmpty ? (
          <Card className="rounded-3xl bg-black/20 border-black">
            <CardHeader>
              <CardTitle className="text-white/80">
                No tasks in this period
              </CardTitle>
            </CardHeader>
            <CardContent className="text-white/50 text-sm font-extralight">
              Add tasks or change the date range to see analytics.
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div data-tour="score-card">
                <ScoreCard summary={summary} />
              </div>
              <div data-tour="compare-panel">
                <ComparePanel mode={mode} compare={compare} />
              </div>
              <div data-tour="forecast-panel">
                <ForecastPanel forecast={forecast} />
              </div>
            </div>

            <div data-tour="summary-cards">
              <SummaryCards summary={summary} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Charts */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div data-tour="daily-trend-chart">
                  <DailyTrendChart dayStats={dayStats} />
                </div>
                <div data-tour="completion-donut">
                  <CompletionDonut summary={summary} />
                </div>
                <div data-tour="timing-bar-chart">
                  <TimingBarChart summary={summary} />
                </div>
                <div data-tour="line-stacked-bar">
                  <LineStackedBar summary={summary} />
                </div>
                <div data-tour="tag-completion-chart">
                  <TagCompletionChart summary={summary} />
                </div>
                <div data-tour="weekday-habit-chart">
                  <WeekdayHabitChart data={weekdayHabit} />
                </div>
              </div>

              {/* Side */}
              <div className="space-y-4">
                <div data-tour="insights-panel">
                  <InsightsPanel insights={insights} summary={summary} />
                </div>
                <div data-tour="export-panel">
                  <ExportPanel reportText={reportText} summary={summary} />
                </div>
              </div>
            </div>

            <div data-tour="tag-effectiveness-table">
              <TagEffectivenessTable rows={summary.byTag} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
