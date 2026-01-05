import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task } from "@/src/features/tasks-board/types";
import { WeekDays } from "@/src/types/common";
import { TASKS_TEST_DATA } from "@/src/tests/task.testdata";

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
      tasks: TASKS_TEST_DATA,

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
