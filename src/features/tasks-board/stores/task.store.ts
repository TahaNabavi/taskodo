import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "@/src/features/tasks-board/types";
import { WeekDays } from "@/src/types/common";

type Line = 1 | 2 | 3;

type TasksState = {
  tasks: Task[];

  setTasks: (tasks: Task[]) => void;
  clearTasks: () => void;

  newTask: (task: Task) => void;
  upsertTask: (task: Task) => void;
  updateTask: (id: Task["id"], data: Partial<Omit<Task, "id">>) => void;
  removeTask: (id: Task["id"]) => void;

  // DnD
  moveTask: (taskId: string, toLine: Line, toOrder?: number) => void;
  reorderWithinLine: (line: Line, orderedIds: string[]) => void;

  // selectors/helpers
  getTaskById: (id: Task["id"]) => Task | undefined;
  getTasksForDay: (day: WeekDays | Date) => Task[];
};

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function matchesDay(task: Task, day: WeekDays | Date) {
  if (task.weekly) {
    return typeof day === "string" && task.days.includes(day);
  }
  return (
    day instanceof Date && task.days.some((d) => isSameDay(new Date(d), day))
  );
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [
        // {
        //   id: "sun-l1-1",
        //   title: "Sunday Planning",
        //   desc: "Review your goals and plan the top 3 priorities for this week.",
        //   tags: [{ id: "planning", label: "Planning" }],
        //   color: "zinc",
        //   line: 1,
        //   order: 1,
        //   checked: [],
        //   weekly: true,
        //   days: ["sunday", "saturday"],
        // },
        // {
        //   id: "sun-l1-2",
        //   title: "Weekly Overview",
        //   desc: "Check your schedule and prepare for important events.",
        //   tags: [{ id: "work", label: "Work" }],
        //   color: "blue",
        //   line: 1,
        //   order: 2,
        //   checked: [],
        //   weekly: true,
        //   days: ["sunday", "saturday"],
        // },
        // {
        //   id: "sun-l1-3",
        //   title: "Inbox Cleanup",
        //   desc: "Clear your inbox and archive anything unnecessary.",
        //   tags: [{ id: "admin", label: "Admin" }],
        //   color: "slate",
        //   line: 1,
        //   order: 3,
        //   checked: [],
        //   weekly: true,
        //   days: ["sunday", "saturday"],
        // },
        // // Line 2
        // {
        //   id: "sun-l2-1",
        //   title: "Deep Learning",
        //   desc: "Spend 45 minutes learning something valuable and take notes.",
        //   tags: [{ id: "learning", label: "Learning" }],
        //   color: "indigo",
        //   line: 2,
        //   order: 1,
        //   checked: [],
        //   weekly: true,
        //   days: ["sunday", "saturday"],
        // },
        // {
        //   id: "sun-l2-2",
        //   title: "Side Project",
        //   desc: "Work 1 hour on a side project or personal build.",
        //   tags: [{ id: "creative", label: "Creative" }],
        //   color: "fuchsia",
        //   line: 2,
        //   order: 2,
        //   checked: [],
        //   weekly: true,
        //   days: ["sunday", "saturday"],
        // },
        // {
        //   id: "sun-l2-3",
        //   title: "Skill Practice",
        //   desc: "Practice a technical skill: coding, reading docs, or exercises.",
        //   tags: [{ id: "practice", label: "Practice" }],
        //   color: "violet",
        //   line: 2,
        //   order: 3,
        //   checked: [],
        //   weekly: true,
        //   days: ["sunday", "saturday"],
        // },
        // // Line 3
        // {
        //   id: "sun-l3-1",
        //   title: "Walk & Reset",
        //   desc: "Go for a light walk to refresh your mind.",
        //   tags: [{ id: "health", label: "Health" }],
        //   color: "emerald",
        //   line: 3,
        //   order: 1,
        //   checked: [],
        //   weekly: true,
        //   days: ["sunday", "saturday"],
        // },
        // {
        //   id: "sun-l3-2",
        //   title: "Meal Prep",
        //   desc: "Prepare food for the week so weekdays become easier.",
        //   tags: [{ id: "home", label: "Home" }],
        //   color: "amber",
        //   line: 3,
        //   order: 2,
        //   checked: [],
        //   weekly: true,
        //   days: ["sunday", "saturday"],
        // },
        // {
        //   id: "sun-l3-3",
        //   title: "Relax Time",
        //   desc: "Do something enjoyable without guilt for at least 1 hour.",
        //   tags: [{ id: "life", label: "Life" }],
        //   color: "rose",
        //   line: 3,
        //   order: 3,
        //   checked: [],
        //   weekly: true,
        //   days: ["sunday", "saturday"],
        // },
      ],

      setTasks: (tasks) => set({ tasks }),
      clearTasks: () => set({ tasks: [] }),

      newTask: (task) => set((p) => ({ tasks: [...p.tasks, task] })),

      upsertTask: (task) =>
        set((p) => {
          const idx = p.tasks.findIndex((t) => t.id === task.id);
          if (idx === -1) return { tasks: [...p.tasks, task] };
          const next = [...p.tasks];
          next[idx] = task;
          return { tasks: next };
        }),

      updateTask: (id, data) =>
        set((p) => {
          const idx = p.tasks.findIndex((t) => t.id === id);
          if (idx === -1) return p;
          const next = [...p.tasks];
          next[idx] = { ...next[idx], ...(data as Task) };
          return { tasks: next };
        }),

      removeTask: (id) =>
        set((p) => ({ tasks: p.tasks.filter((t) => t.id !== id) })),

      moveTask: (taskId, toLine, toOrder) =>
        set((p) => {
          const idx = p.tasks.findIndex((t) => t.id === taskId);
          if (idx === -1) return p;

          const next = [...p.tasks];
          const task = next[idx];

          const maxOrderInTarget =
            Math.max(
              0,
              ...next.filter((t) => t.line === toLine).map((t) => t.order ?? 0),
            ) || 0;

          next[idx] = {
            ...task,
            line: toLine,
            order: toOrder ?? maxOrderInTarget + 1,
          };

          return { tasks: next };
        }),

      reorderWithinLine: (line, orderedIds) =>
        set((p) => {
          const next = p.tasks.map((t) => ({ ...t }));

          orderedIds.forEach((id, i) => {
            const idx = next.findIndex((t) => t.id === id);
            if (idx !== -1 && next[idx].line === line) {
              next[idx].order = i + 1;
            }
          });

          return { tasks: next };
        }),

      getTaskById: (id) => get().tasks.find((t) => t.id === id),

      getTasksForDay: (day) =>
        get()
          .tasks.filter((t) => matchesDay(t, day))
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }),
    { name: "tasks-store", partialize: (s) => ({ tasks: s.tasks }) },
  ),
);
