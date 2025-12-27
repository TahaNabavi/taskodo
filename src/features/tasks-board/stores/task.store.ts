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
        {
          id: "t-1",
          title: "Team standup",
          desc: "Daily sync with the product team",
          tags: [{ id: "work", label: "Work" }],
          color: "#3b82f6",
          line: 1,
          order: 1,
          checked: [],
          weekly: true,
          days: [],
        },
        {
          id: "t-2",
          title: "Morning workout",
          desc: "30 minutes cardio + stretching",
          tags: [{ id: "health", label: "Health" }],
          color: "#22c55e",
          line: 1,
          order: 2,
          checked: [],
          weekly: true,
          days: [],
        },
        {
          id: "t-3",
          title: "Deep focus session",
          desc: "No meetings, code only",
          tags: [{ id: "focus", label: "Focus" }],
          color: "#6366f1",
          line: 2,
          order: 1,
          checked: [],
          weekly: true,
          days: [],
        },
        {
          id: "t-4",
          title: "Reply to emails",
          desc: "Inbox zero (15 minutes)",
          tags: [{ id: "admin", label: "Admin" }],
          color: "#64748b",
          line: 2,
          order: 2,
          checked: [],
          weekly: true,
          days: [],
        },
        {
          id: "t-5",
          title: "Read technical article",
          desc: "Frontend performance optimization",
          tags: [{ id: "learning", label: "Learning" }],
          color: "#14b8a6",
          line: 3,
          order: 1,
          checked: [],
          weekly: true,
          days: [],
        },
        {
          id: "t-6",
          title: "Grocery shopping",
          desc: "Food for the week",
          tags: [{ id: "home", label: "Home" }],
          color: "#f97316",
          line: 3,
          order: 2,
          checked: [],
          weekly: true,
          days: [],
        },
        {
          id: "t-7",
          title: "Weekly review",
          desc: "Reflect + plan next week",
          tags: [{ id: "planning", label: "Planning" }],
          color: "#e11d48",
          line: 2,
          order: 1,
          checked: [],
          weekly: true,
          days: [],
        },

        // Non-weekly example (date-based). Keep if you will later support date tabs/views.
        {
          id: "t-8",
          title: "Doctor appointment",
          desc: "Annual checkup",
          tags: [{ id: "health", label: "Health" }],
          color: "#0ea5e9",
          line: 1,
          order: 3,
          checked: [],
          weekly: false,
          days: [],
        },
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
          //   const idsSet = new Set(orderedIds);

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
