"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import type { WeekDays } from "@/src/types/common";
import { getMostRecentWeekdayDate, toLocalDateKey } from "@/src/utils";

import { useTasksStore } from "../stores/task.store";
import type { Task } from "../types";
import { Line, LineColumn } from "./line-column";
import { DragTaskOverlay } from "./drag-task-overlay";

type Props = {
  activeDay: WeekDays;
};

export function TaskLinesBoard({ activeDay }: Props) {
  const tasks = useTasksStore((s) => s.tasks);
  const updateTask = useTasksStore((s) => s.updateTask);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const viewDate = getMostRecentWeekdayDate(new Date(), activeDay);
  const viewKey = toLocalDateKey(viewDate);

  const dayTasks = tasks.filter((t) => {
    if (!t.days.includes(activeDay)) return false;
    if (t.weekly) return true;
    if (!t.startDateKey || !t.endDateKey) return false;
    return viewKey >= t.startDateKey && viewKey <= t.endDateKey;
  });

  const viewDateKey = useMemo(() => toLocalDateKey(viewDate), [viewDate]);

  const activeTask = useMemo(
    () => (activeId ? (dayTasks.find((t) => t.id === activeId) ?? null) : null),
    [activeId, dayTasks],
  );

  const sortForViewDay = (a: Task, b: Task) => {
    const aChecked = a.checked.some((c) => c.date === viewDateKey);
    const bChecked = b.checked.some((c) => c.date === viewDateKey);

    if (aChecked !== bChecked) return !aChecked ? -1 : 1;

    return a.order - b.order;
  };

  const byLine: Record<Line, Task[]> = {
    1: dayTasks.filter((t) => t.line === 1).sort(sortForViewDay),
    2: dayTasks.filter((t) => t.line === 2).sort(sortForViewDay),
    3: dayTasks.filter((t) => t.line === 3).sort(sortForViewDay),
  };

  function normalizeOrder(line: Line) {
    const sorted = byLine[line];
    sorted.forEach((t, idx) => {
      if (t.order !== idx) updateTask(t.id, { order: idx });
    });
  }

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragCancel() {
    setActiveId(null);
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const activeTask = dayTasks.find((t) => t.id === String(active.id));
    if (!activeTask) return;

    const overId = String(over.id);

    if (overId.startsWith("line-")) {
      const toLine = Number(overId.replace("line-", "")) as Line;
      if (activeTask.line !== toLine) {
        const nextOrder = byLine[toLine].length;
        updateTask(activeTask.id, { line: toLine, order: nextOrder });
        normalizeOrder(activeTask.line as Line);
      }
      return;
    }

    const overTask = dayTasks.find((t) => t.id === overId);
    if (!overTask) return;

    if (activeTask.line !== overTask.line) {
      const fromLine = activeTask.line as Line;
      const toLine = overTask.line as Line;

      updateTask(activeTask.id, { line: toLine, order: overTask.order });
      normalizeOrder(fromLine);
      normalizeOrder(toLine);
      return;
    }

    const line = activeTask.line as Line;
    const ids = byLine[line].map((t) => t.id);
    const oldIndex = ids.indexOf(activeTask.id);
    const newIndex = ids.indexOf(overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const moved = arrayMove(byLine[line], oldIndex, newIndex);
    moved.forEach((t, idx) => {
      if (t.order !== idx) updateTask(t.id, { order: idx });
    });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragCancel={onDragCancel}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-3">
        <LineColumn
          line={1}
          title="Line 1"
          tasks={byLine[1]}
          dateKey={viewDateKey}
        />
        <LineColumn
          line={2}
          title="Line 2"
          tasks={byLine[2]}
          dateKey={viewDateKey}
        />
        <LineColumn
          line={3}
          title="Line 3"
          tasks={byLine[3]}
          dateKey={viewDateKey}
        />
      </div>

      <DragTaskOverlay activeTask={activeTask} />
    </DndContext>
  );
}
