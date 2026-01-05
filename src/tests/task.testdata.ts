import type { Task } from "@/src/features/tasks-board/types";
import type { WeekDays } from "@/src/types/common";

const ALL_DAYS: WeekDays[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const TASKS_TEST_DATA: Task[] = [
  // ======================
  // LINE 1 (3 tasks)
  // ======================
  {
    id: "l1-1",
    title: "Morning Planning",
    desc: "Review priorities and plan the day in 5 minutes.",
    tags: [{ id: "planning", label: "Planning" }],
    color: "zinc",
    effort: 1,
    line: 1,
    order: 0,
    weekly: true,
    days: ALL_DAYS,
    checked: [
      { date: "2026-01-01", late: false, early: false },
      { date: "2026-01-02", late: false, early: true },
      { date: "2026-01-03", late: false, early: false },
      { date: "2026-01-04", late: true, early: false },
      { date: "2026-01-05", late: false, early: false },
    ],
  },
  {
    id: "l1-2",
    title: "Workout / Stretch",
    desc: "30 minutes cardio + stretching for energy.",
    tags: [{ id: "health", label: "Health" }],
    color: "green",
    effort: 3,
    line: 1,
    order: 1,
    weekly: true,
    days: ALL_DAYS,
    checked: [
      { date: "2026-01-01", late: false, early: false },
      { date: "2026-01-02", late: false, early: false },
      { date: "2026-01-03", late: true, early: false },
      { date: "2026-01-05", late: false, early: false },
    ],
  },
  {
    id: "l1-3",
    title: "Daily Deep Work",
    desc: "90 minutes focused coding with zero distractions.",
    tags: [{ id: "focus", label: "Focus" }],
    color: "indigo",
    effort: 5,
    line: 1,
    order: 2,
    weekly: true,
    days: ALL_DAYS,
    checked: [
      { date: "2026-01-01", late: false, early: false },
      { date: "2026-01-02", late: false, early: false },
      { date: "2026-01-04", late: true, early: false },
    ],
  },

  // ======================
  // LINE 2 (3 tasks)
  // ======================
  {
    id: "l2-1",
    title: "Inbox Zero",
    desc: "Clear and reply to important emails (15 min).",
    tags: [{ id: "admin", label: "Admin" }],
    color: "slate",
    effort: 2,
    line: 2,
    order: 0,
    weekly: true,
    days: ALL_DAYS,
    checked: [
      { date: "2026-01-01", late: false, early: false },
      { date: "2026-01-03", late: false, early: true },
      { date: "2026-01-04", late: true, early: false },
      { date: "2026-01-05", late: false, early: false },
    ],
  },
  {
    id: "l2-2",
    title: "Team Standup",
    desc: "Quick daily sync with the product team.",
    tags: [{ id: "work", label: "Work" }],
    color: "blue",
    effort: 1,
    line: 2,
    order: 1,
    weekly: true,
    days: ALL_DAYS,
    checked: [
      { date: "2026-01-01", late: false, early: false },
      { date: "2026-01-02", late: false, early: false },
      { date: "2026-01-03", late: false, early: false },
      { date: "2026-01-04", late: false, early: false },
      { date: "2026-01-05", late: false, early: false },
    ],
  },
  {
    id: "l2-3",
    title: "Learning Block",
    desc: "Watch or read something valuable for growth.",
    tags: [{ id: "learning", label: "Learning" }],
    color: "teal",
    effort: 3,
    line: 2,
    order: 2,
    weekly: true,
    days: ALL_DAYS,
    checked: [
      { date: "2026-01-02", late: true, early: false },
      { date: "2026-01-03", late: false, early: false },
      { date: "2026-01-05", late: false, early: true },
    ],
  },

  // ======================
  // LINE 3 (3 tasks)
  // ======================
  {
    id: "l3-1",
    title: "Read Technical Article",
    desc: "One article about engineering or performance.",
    tags: [{ id: "learning", label: "Learning" }],
    color: "amber",
    effort: 2,
    line: 3,
    order: 0,
    weekly: true,
    days: ALL_DAYS,
    checked: [
      { date: "2026-01-01", late: true, early: false },
      { date: "2026-01-03", late: false, early: false },
    ],
  },
  {
    id: "l3-2",
    title: "Relax / Reset",
    desc: "Take a short break, music or breathing exercises.",
    tags: [{ id: "mind", label: "Mind" }],
    color: "violet",
    effort: 1,
    line: 3,
    order: 1,
    weekly: true,
    days: ALL_DAYS,
    checked: [
      { date: "2026-01-01", late: false, early: false },
      { date: "2026-01-02", late: false, early: false },
      { date: "2026-01-04", late: false, early: true },
      { date: "2026-01-05", late: false, early: false },
    ],
  },
  {
    id: "l3-3",
    title: "Journal Reflection",
    desc: "Write 3 lines about progress and feelings.",
    tags: [{ id: "personal", label: "Personal" }],
    color: "rose",
    effort: 2,
    line: 3,
    order: 2,
    weekly: true,
    days: ALL_DAYS,
    checked: [
      { date: "2026-01-02", late: true, early: false },
      { date: "2026-01-03", late: false, early: false },
      { date: "2026-01-04", late: false, early: false },
    ],
  },

  // ======================
  // RANGED TASKS (extra)
  // ======================
  {
    id: "range-1",
    title: "Doctor Appointment Prep",
    desc: "Collect documents and test results for appointment.",
    tags: [{ id: "health", label: "Health" }],
    color: "cyan",
    effort: 3,
    line: 1,
    order: 99,
    weekly: false,
    days: [], // ignored for ranged tasks
    startDateKey: "2026-01-03",
    endDateKey: "2026-01-07",
    checked: [{ date: "2026-01-04", late: false, early: false }],
  },
  {
    id: "range-2",
    title: "Release v1.0",
    desc: "Ship Taskodo v1.0 and publish announcement.",
    tags: [{ id: "work", label: "Work" }],
    color: "fuchsia",
    effort: 5,
    line: 2,
    order: 99,
    weekly: false,
    days: [],
    startDateKey: "2026-01-01",
    endDateKey: "2026-01-10",
    checked: [{ date: "2026-01-05", late: true, early: false }],
  },
];
