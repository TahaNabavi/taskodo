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
import { addDays, toLocalDateKey } from "@/src/utils";

import { useTasksStore } from "../stores/task.store";
import type { Task } from "../types";
import { Line, LineColumn } from "./line-column";
import { DragTaskOverlay } from "./drag-task-overlay";

type Props = {
  activeDay: WeekDays;
  weekStart: Date;
  visibleLines?: Line[];
};

export function TaskLinesBoard({ activeDay, weekStart, visibleLines }: Props) {
  const tasks = useTasksStore((s) => s.tasks);
  const updateTask = useTasksStore((s) => s.updateTask);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  /* ---------------------------------------------
     View date: compute dateKey for the selected weekday
     --------------------------------------------- */
  const dayIndex = useMemo(() => {
    const map: Record<WeekDays, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    return map[activeDay];
  }, [activeDay]);

  const viewDate = useMemo(
    () => addDays(weekStart, dayIndex),
    [weekStart, dayIndex],
  );
  const viewDateKey = useMemo(() => toLocalDateKey(viewDate), [viewDate]);

  /* ---------------------------------------------
     Filter tasks that should appear on this day
     --------------------------------------------- */
  const dayTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (!t.days.includes(activeDay)) return false;

      if (t.weekly) return true;

      // non-weekly range tasks
      if (!t.startDateKey || !t.endDateKey) return false;
      return viewDateKey >= t.startDateKey && viewDateKey <= t.endDateKey;
    });
  }, [tasks, activeDay, viewDateKey]);

  /* ---------------------------------------------
     Sorting: unchecked first, then by order
     --------------------------------------------- */
  const sortForViewDay = useMemo(() => {
    return (a: Task, b: Task) => {
      const aChecked = a.checked.some((c) => c.date === viewDateKey);
      const bChecked = b.checked.some((c) => c.date === viewDateKey);

      if (aChecked !== bChecked) return aChecked ? 1 : -1;

      return (a.order ?? 0) - (b.order ?? 0);
    };
  }, [viewDateKey]);

  /* ---------------------------------------------
     Group tasks by line (memoized)
     --------------------------------------------- */
  const byLine: Record<Line, Task[]> = useMemo(() => {
    return {
      1: dayTasks
        .filter((t) => t.line === 1)
        .slice()
        .sort(sortForViewDay),
      2: dayTasks
        .filter((t) => t.line === 2)
        .slice()
        .sort(sortForViewDay),
      3: dayTasks
        .filter((t) => t.line === 3)
        .slice()
        .sort(sortForViewDay),
    };
  }, [dayTasks, sortForViewDay]);

  /* ---------------------------------------------
     DnD helpers
     --------------------------------------------- */
  function normalizeOrder(line: Line) {
    const sorted = byLine[line];
    sorted.forEach((t, idx) => {
      const target = idx + 1; // your store uses 1-based order
      if (t.order !== target) updateTask(t.id, { order: target });
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

    // Dropped into empty line container
    if (overId.startsWith("line-")) {
      const toLine = Number(overId.replace("line-", "")) as Line;
      if (activeTask.line !== toLine) {
        const nextOrder = (byLine[toLine]?.length ?? 0) + 1;
        updateTask(activeTask.id, { line: toLine, order: nextOrder });
        normalizeOrder(activeTask.line as Line);
      }
      return;
    }

    // Dropped on another task
    const overTask = dayTasks.find((t) => t.id === overId);
    if (!overTask) return;

    // Cross-line move (insert at overTask.order)
    if (activeTask.line !== overTask.line) {
      const fromLine = activeTask.line as Line;
      const toLine = overTask.line as Line;

      updateTask(activeTask.id, { line: toLine, order: overTask.order ?? 1 });

      normalizeOrder(fromLine);
      normalizeOrder(toLine);
      return;
    }

    // Same-line reorder
    const line = activeTask.line as Line;

    const ids = byLine[line].map((t) => t.id);
    const oldIndex = ids.indexOf(activeTask.id);
    const newIndex = ids.indexOf(overId);
    if (oldIndex === -1 || newIndex === -1) return;

    const moved = arrayMove(byLine[line], oldIndex, newIndex);

    moved.forEach((t, idx) => {
      const target = idx + 1; // 1-based order
      if (t.order !== target) updateTask(t.id, { order: target });
    });
  }

  /* ---------------------------------------------
     Overlay task
     --------------------------------------------- */
  const activeTask = useMemo(() => {
    if (!activeId) return null;
    return dayTasks.find((t) => t.id === activeId) ?? null;
  }, [activeId, dayTasks]);

  /* ---------------------------------------------
     Which lines to render
     --------------------------------------------- */
  const linesToShow: Line[] = useMemo(() => {
    if (visibleLines?.length) return visibleLines;
    return [1, 2, 3];
  }, [visibleLines]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragCancel={onDragCancel}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-3 flex-col xl:flex-row">
        {linesToShow.includes(1) && (
          <LineColumn
            line={1}
            title="Line 1"
            tasks={byLine[1]}
            dateKey={viewDateKey}
          />
        )}

        {linesToShow.includes(2) && (
          <LineColumn
            line={2}
            title="Line 2"
            tasks={byLine[2]}
            dateKey={viewDateKey}
          />
        )}

        {linesToShow.includes(3) && (
          <LineColumn
            line={3}
            title="Line 3"
            tasks={byLine[3]}
            dateKey={viewDateKey}
          />
        )}
      </div>

      <DragTaskOverlay activeTask={activeTask} />
    </DndContext>
  );
}
