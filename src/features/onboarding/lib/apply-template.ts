import type { Task } from "@/src/features/tasks-board/types";

export function createTasksFromTemplate(
  templateTasks: Omit<Task, "id" | "checked" | "order">[],
) {
  return templateTasks.map((t, index) => {
    const id = crypto.randomUUID();
    return {
      ...t,
      id,
      checked: [],
      order: index,
    };
  });
}
