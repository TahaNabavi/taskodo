import type { Task } from "@/src/features/tasks-board/types";
import type { WeekDays } from "@/src/types/common";
import {
  dateFromKey,
  eachDateKey,
  weekdayOfDateKey,
  startOfWeekSunday,
  addDays,
  toLocalDateKey,
} from "@/src/utils";

export type AnalyticsRange = {
  from: Date;
  to: Date;
  fromKey: string;
  toKey: string;
  keys: string[];
};

export type DayStats = {
  dateKey: string;
  weekday: WeekDays;
  scheduled: Task[];
  completed: Task[];
  counts: {
    scheduled: number;
    completed: number;
    unfinished: number;
    late: number;
    early: number;
    onTime: number;
  };
  effort: {
    scheduled: number;
    completed: number;
    unfinished: number;
  };
};

export type SummaryStats = {
  scheduledTotal: number;
  completedTotal: number;
  unfinishedTotal: number;
  completionRate: number;

  effort: {
    scheduled: number;
    completed: number;
    unfinished: number;
    completionRate: number;
  };

  timing: {
    late: number;
    early: number;
    onTime: number;
    lateRate: number;
  };

  avgCompletedPerDay: number;

  streak: {
    current: number;
    longest: number;
  };

  mostProductiveDay?: { dateKey: string; completed: number };

  byLineCompleted: Record<1 | 2 | 3, number>;
  byTag: {
    tagId: string;
    label: string;
    scheduled: number;
    completed: number;
    completionRate: number;
    lateRate: number;
  }[];

  // ✅ New
  score: number;
  health: "light" | "balanced" | "heavy" | "overloaded";
  consistencyStdDev: number;

  compensation: {
    targetRate: number;
    targetCompletedTotal: number;
    remainingToTarget: number;
    remainingDays: number;
    requiredPerDay: number;
  };
};

export type ForecastStats = {
  scheduledTotal: number;
  busiestDay?: { dateKey: string; scheduled: number };
  heaviestLine?: { line: 1 | 2 | 3; scheduled: number };
  expectedPerDay: number;
};

export type CompareStats = {
  scheduledDelta: number;
  completedDelta: number;
  completionRateDelta: number;
  lateRateDelta: number;
  streakDelta: number;
};

export type Insight = {
  type: "success" | "warn" | "info";
  title: string;
  detail: string;
};

export type AnalyticsFilters = {
  line?: 1 | 2 | 3;
  tagId?: string;
  completedOnly?: boolean;
};

function effortOf(task: Task) {
  return task.effort ?? 1;
}

export function buildRange(from: Date, to: Date): AnalyticsRange {
  const f = new Date(from);
  const t = new Date(to);
  f.setHours(0, 0, 0, 0);
  t.setHours(0, 0, 0, 0);

  return {
    from: f,
    to: t,
    fromKey: toLocalDateKey(f),
    toKey: toLocalDateKey(t),
    keys: eachDateKey(f, t),
  };
}

function isScheduledOn(task: Task, dateKey: string, weekday: WeekDays) {
  if (task.weekly) return task.days.includes(weekday);
  if (!task.startDateKey || !task.endDateKey) return false;
  return dateKey >= task.startDateKey && dateKey <= task.endDateKey;
}

function checkedEntry(task: Task, dateKey: string) {
  return task.checked.find((c) => c.date === dateKey);
}

function matchesFilters(task: Task, filters?: AnalyticsFilters) {
  if (!filters) return true;
  if (filters.line && task.line !== filters.line) return false;
  if (filters.tagId && !task.tags.some((t) => t.id === filters.tagId))
    return false;
  return true;
}

export function buildDayStats(
  tasks: Task[],
  range: AnalyticsRange,
  filters?: AnalyticsFilters,
): DayStats[] {
  return range.keys.map((dateKey) => {
    const weekday = weekdayOfDateKey(dateKey);

    const scheduled = tasks.filter(
      (t) => matchesFilters(t, filters) && isScheduledOn(t, dateKey, weekday),
    );

    const completed = scheduled.filter((t) =>
      Boolean(checkedEntry(t, dateKey)),
    );

    // completedOnly filter applies AFTER completion
    const finalScheduled = filters?.completedOnly ? completed : scheduled;

    // timing
    let late = 0;
    let early = 0;
    let onTime = 0;

    completed.forEach((t) => {
      const c = checkedEntry(t, dateKey);
      if (!c) return;
      if (c.late) late += 1;
      else if (c.early) early += 1;
      else onTime += 1;
    });

    // effort totals
    const effortScheduled = finalScheduled.reduce((a, t) => a + effortOf(t), 0);
    const effortCompleted = completed.reduce((a, t) => a + effortOf(t), 0);
    const effortUnfinished = Math.max(0, effortScheduled - effortCompleted);

    return {
      dateKey,
      weekday,
      scheduled: finalScheduled,
      completed,
      counts: {
        scheduled: finalScheduled.length,
        completed: completed.length,
        unfinished: finalScheduled.length - completed.length,
        late,
        early,
        onTime,
      },
      effort: {
        scheduled: effortScheduled,
        completed: effortCompleted,
        unfinished: effortUnfinished,
      },
    };
  });
}

export function computeStreaks(dayStats: DayStats[], todayKey: string) {
  let longest = 0;
  let run = 0;

  for (const d of dayStats) {
    if (d.counts.completed > 0) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
  }

  const idx = dayStats.findIndex((d) => d.dateKey === todayKey);
  const start = idx !== -1 ? idx : dayStats.length - 1;

  let current = 0;
  for (let i = start; i >= 0; i--) {
    if (dayStats[i].counts.completed > 0) current += 1;
    else break;
  }

  return { current, longest };
}

export function computeConsistencyStdDev(dayStats: DayStats[]) {
  const values = dayStats.map((d) => d.counts.completed);
  if (values.length <= 1) return 0;

  const mean = values.reduce((a, v) => a + v, 0) / values.length;
  const variance =
    values.reduce((a, v) => a + (v - mean) ** 2, 0) / values.length;

  return Math.sqrt(variance);
}

export function computeHealth(scheduledTotal: number, days: number) {
  const perDay = days === 0 ? 0 : scheduledTotal / days;
  if (perDay <= 4) return "light";
  if (perDay <= 7) return "balanced";
  if (perDay <= 10) return "heavy";
  return "overloaded";
}

export function computeScore(summary: {
  completionRate: number;
  lateRate: number;
  currentStreak: number;
  consistencyStdDev: number;
}) {
  const base = summary.completionRate * 70; // max 70 points
  const streakBoost = Math.min(20, summary.currentStreak * 2.5); // max 20
  const latePenalty = summary.lateRate * 20; // max -20
  const consistencyPenalty = Math.min(15, summary.consistencyStdDev * 2); // max -15

  const score = base + streakBoost - latePenalty - consistencyPenalty;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function computeTagEffectiveness(dayStats: DayStats[]) {
  const map = new Map<
    string,
    {
      tagId: string;
      label: string;
      scheduled: number;
      completed: number;
      late: number;
      totalTimed: number;
    }
  >();

  dayStats.forEach((d) => {
    d.scheduled.forEach((t) => {
      t.tags.forEach((tag) => {
        const prev = map.get(tag.id);
        if (!prev) {
          map.set(tag.id, {
            tagId: tag.id,
            label: tag.label,
            scheduled: 1,
            completed: 0,
            late: 0,
            totalTimed: 0,
          });
        } else {
          prev.scheduled += 1;
        }
      });
    });

    d.completed.forEach((t) => {
      const c = checkedEntry(t, d.dateKey);
      t.tags.forEach((tag) => {
        const prev = map.get(tag.id);
        if (!prev) return;
        prev.completed += 1;
        if (c) {
          prev.totalTimed += 1;
          if (c.late) prev.late += 1;
        }
      });
    });
  });

  return Array.from(map.values())
    .map((x) => ({
      tagId: x.tagId,
      label: x.label,
      scheduled: x.scheduled,
      completed: x.completed,
      completionRate: x.scheduled === 0 ? 0 : x.completed / x.scheduled,
      lateRate: x.totalTimed === 0 ? 0 : x.late / x.totalTimed,
    }))
    .slice()
    .sort((a, b) => b.completed - a.completed);
}

export function computeWeekdayHabitConsistency(tasks: Task[]) {
  const weekdays: Record<WeekDays, { completed: number; scheduled: number }> = {
    sunday: { completed: 0, scheduled: 0 },
    monday: { completed: 0, scheduled: 0 },
    tuesday: { completed: 0, scheduled: 0 },
    wednesday: { completed: 0, scheduled: 0 },
    thursday: { completed: 0, scheduled: 0 },
    friday: { completed: 0, scheduled: 0 },
    saturday: { completed: 0, scheduled: 0 },
  };

  // We approximate scheduled history using checked dates:
  // For each checked entry => it implies that weekday had a scheduled task occurrence.
  tasks.forEach((t) => {
    t.checked.forEach((c) => {
      const wd = weekdayOfDateKey(c.date);
      weekdays[wd].completed += 1;
      weekdays[wd].scheduled += 1;
    });
  });

  return Object.entries(weekdays).map(([day, v]) => ({
    day: day as WeekDays,
    scheduled: v.scheduled,
    completed: v.completed,
    completionRate: v.scheduled === 0 ? 0 : v.completed / v.scheduled,
  }));
}

export function computeForecast(tasks: Task[], baseDate: Date) {
  const start = startOfWeekSunday(addDays(baseDate, 7)); // next week start
  const end = addDays(start, 6);
  const range = buildRange(start, end);
  const dayStats = buildDayStats(tasks, range);

  const scheduledTotal = dayStats.reduce((a, d) => a + d.counts.scheduled, 0);

  const busiestDay = dayStats
    .slice()
    .sort((a, b) => b.counts.scheduled - a.counts.scheduled)[0];
  const busiest =
    busiestDay.counts.scheduled > 0
      ? { dateKey: busiestDay.dateKey, scheduled: busiestDay.counts.scheduled }
      : undefined;

  const byLine: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  dayStats.forEach((d) =>
    d.scheduled.forEach((t) => {
      byLine[t.line] += 1;
    }),
  );

  const heaviestLineEntry = (Object.entries(byLine) as never[])
    .slice()
    .sort((a, b) => b[1] - a[1])[0];

  const heaviestLine =
    heaviestLineEntry && heaviestLineEntry[1] > 0
      ? {
          line: Number(heaviestLineEntry[0]) as 1 | 2 | 3,
          scheduled: heaviestLineEntry[1],
        }
      : undefined;

  return {
    scheduledTotal,
    busiestDay: busiest,
    heaviestLine,
    expectedPerDay: scheduledTotal / 7,
  } satisfies ForecastStats;
}

export function computeSummary(
  dayStats: DayStats[],
  opts: { targetRate: number; todayKey: string },
): SummaryStats {
  const scheduledTotal = dayStats.reduce((a, d) => a + d.counts.scheduled, 0);
  const completedTotal = dayStats.reduce((a, d) => a + d.counts.completed, 0);
  const unfinishedTotal = scheduledTotal - completedTotal;

  const effortScheduled = dayStats.reduce((a, d) => a + d.effort.scheduled, 0);
  const effortCompleted = dayStats.reduce((a, d) => a + d.effort.completed, 0);
  const effortUnfinished = Math.max(0, effortScheduled - effortCompleted);

  const completionRate =
    scheduledTotal === 0 ? 0 : completedTotal / scheduledTotal;
  const effortCompletionRate =
    effortScheduled === 0 ? 0 : effortCompleted / effortScheduled;

  const late = dayStats.reduce((a, d) => a + d.counts.late, 0);
  const early = dayStats.reduce((a, d) => a + d.counts.early, 0);
  const onTime = dayStats.reduce((a, d) => a + d.counts.onTime, 0);

  const totalTimed = late + early + onTime;
  const lateRate = totalTimed === 0 ? 0 : late / totalTimed;

  const avgCompletedPerDay =
    dayStats.length === 0 ? 0 : completedTotal / dayStats.length;

  const streak = computeStreaks(dayStats, opts.todayKey);
  const consistencyStdDev = computeConsistencyStdDev(dayStats);
  const health = computeHealth(scheduledTotal, dayStats.length);

  const score = computeScore({
    completionRate,
    lateRate,
    currentStreak: streak.current,
    consistencyStdDev,
  });

  const most = dayStats
    .slice()
    .sort((a, b) => b.counts.completed - a.counts.completed)[0];
  const mostProductiveDay =
    most && most.counts.completed > 0
      ? { dateKey: most.dateKey, completed: most.counts.completed }
      : undefined;

  const byLineCompleted: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  dayStats.forEach((d) =>
    d.completed.forEach((t) => {
      byLineCompleted[t.line] += 1;
    }),
  );

  const byTag = computeTagEffectiveness(dayStats);

  // compensation
  const targetCompletedTotal = Math.ceil(scheduledTotal * opts.targetRate);
  const remainingToTarget = Math.max(0, targetCompletedTotal - completedTotal);

  const today = dateFromKey(opts.todayKey);
  const endKey = dayStats.length
    ? dayStats[dayStats.length - 1].dateKey
    : opts.todayKey;
  const end = dateFromKey(endKey);

  const remainingDays = today > end ? 0 : eachDateKey(today, end).length;

  const requiredPerDay =
    remainingDays === 0 ? remainingToTarget : remainingToTarget / remainingDays;

  return {
    scheduledTotal,
    completedTotal,
    unfinishedTotal,
    completionRate,

    effort: {
      scheduled: effortScheduled,
      completed: effortCompleted,
      unfinished: effortUnfinished,
      completionRate: effortCompletionRate,
    },

    timing: { late, early, onTime, lateRate },

    avgCompletedPerDay,

    streak,

    mostProductiveDay,

    byLineCompleted,

    byTag,

    score,
    health,
    consistencyStdDev,

    compensation: {
      targetRate: opts.targetRate,
      targetCompletedTotal,
      remainingToTarget,
      remainingDays,
      requiredPerDay,
    },
  };
}

export function computeCompare(
  current: SummaryStats,
  prev: SummaryStats,
): CompareStats {
  return {
    scheduledDelta: current.scheduledTotal - prev.scheduledTotal,
    completedDelta: current.completedTotal - prev.completedTotal,
    completionRateDelta: current.completionRate - prev.completionRate,
    lateRateDelta: current.timing.lateRate - prev.timing.lateRate,
    streakDelta: current.streak.current - prev.streak.current,
  };
}

export function buildInsights(summary: SummaryStats): Insight[] {
  const insights: Insight[] = [];

  if (summary.health === "overloaded") {
    insights.push({
      type: "warn",
      title: "Overloaded schedule",
      detail:
        "You have a high daily workload. Focus on Line 1 tasks and reduce low-impact work.",
    });
  } else if (summary.health === "heavy") {
    insights.push({
      type: "warn",
      title: "Heavy workload",
      detail:
        "Your schedule is heavy. Consider limiting Line 3 tasks to protect energy.",
    });
  } else {
    insights.push({
      type: "success",
      title: "Workload is manageable",
      detail: "Your workload is in a healthy range. Keep your pace stable.",
    });
  }

  if (summary.timing.lateRate >= 0.35 && summary.completedTotal >= 5) {
    insights.push({
      type: "warn",
      title: "Late completion rate is high",
      detail:
        "You often complete tasks late. Try doing Line 1 tasks earlier or reducing daily load.",
    });
  }

  if (summary.streak.current >= 5) {
    insights.push({
      type: "success",
      title: "Strong streak",
      detail: `You’re on a ${summary.streak.current}-day streak. Consistency is building.`,
    });
  } else if (summary.streak.current === 0 && summary.completedTotal > 0) {
    insights.push({
      type: "info",
      title: "No current streak",
      detail: "Try completing at least one task per day to build consistency.",
    });
  }

  if (
    summary.compensation.remainingToTarget > 0 &&
    summary.compensation.remainingDays > 0
  ) {
    insights.push({
      type: "warn",
      title: "You’re falling behind the target",
      detail: `To reach ${(summary.compensation.targetRate * 100).toFixed(
        0,
      )}%, aim for ${summary.compensation.requiredPerDay.toFixed(1)} tasks/day.`,
    });
  }

  if (summary.byTag.length > 0) {
    const best = summary.byTag
      .slice()
      .sort((a, b) => b.completionRate - a.completionRate)[0];
    insights.push({
      type: "info",
      title: "Best-performing category",
      detail: `"${best.label}" has your highest completion rate. Apply similar structure to other categories.`,
    });
  }

  return insights.slice(0, 8);
}

export function buildShareableReport(summary: SummaryStats) {
  const completionPct = Math.round(summary.completionRate * 100);
  const effortPct = Math.round(summary.effort.completionRate * 100);
  const latePct = Math.round(summary.timing.lateRate * 100);

  const lines = [
    `Taskodo Analytics Report`,
    ``,
    `• Scheduled: ${summary.scheduledTotal}`,
    `• Completed: ${summary.completedTotal}`,
    `• Completion: ${completionPct}%`,
    `• Late rate: ${latePct}%`,
    `• Current streak: ${summary.streak.current} days`,
    `• Productivity score: ${summary.score}/100`,
    ``,
    `Effort`,
    `• Scheduled: ${summary.effort.scheduled}`,
    `• Completed: ${summary.effort.completed}`,
    `• Effort completion: ${effortPct}%`,
  ];

  if (
    summary.compensation.remainingToTarget > 0 &&
    summary.compensation.remainingDays > 0
  ) {
    lines.push(
      ``,
      `Catch-up`,
      `• Needed: ${summary.compensation.remainingToTarget}`,
      `• Days remaining: ${summary.compensation.remainingDays}`,
      `• Required pace: ${summary.compensation.requiredPerDay.toFixed(1)} tasks/day`,
    );
  }

  return lines.join("\n");
}
