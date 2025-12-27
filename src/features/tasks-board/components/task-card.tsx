"use client";

import React, { MouseEvent } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel02Icon,
  ScrollVerticalIcon,
  Tick04Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/src/lib/utils";
import { Button, LiveButton } from "@/src/components/ui";
import { useTasksStore } from "../stores/task.store";
import type { Task } from "../types";
import { toLocalDateKey } from "@/src/utils";

type Props = {
  task: Task;
  dateKey: string;
};

export function TaskCard({ task, dateKey }: Props) {
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const updateTask = useTasksStore((s) => s.updateTask);

  const isChecked = task.checked.some((d) => d.date === dateKey);
  const checked = task.checked.find((d) => d.date === dateKey);

  const toDay = toLocalDateKey(new Date());

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const checkHandler = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    const nextChecked: Task["checked"] = isChecked
      ? task.checked.filter((d) => d.date !== dateKey)
      : [
          ...task.checked,
          { date: dateKey, late: dateKey < toDay, early: dateKey > toDay },
        ];
    updateTask(task.id, { checked: nextChecked });
  };

  const doubleClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("dawd");
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <LiveButton
        onDoubleClick={doubleClickHandler}
        color={task.color as never}
        className={cn(
          "squircle rounded-3xl w-full relative",
          isChecked && "opacity-50",
          isChecked && checked?.late && "border-red-600!",
          isChecked && checked?.early && "border-green-600!",
        )}
      >
        <button
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          type="button"
          aria-label="Drag task"
          className="absolute top-2 -left-5 opacity-0 transition-opacity group-hover:opacity-100 hover:text-white cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          onClick={(e) => e.stopPropagation()}
        >
          <HugeiconsIcon
            icon={ScrollVerticalIcon}
            className="h-5 w-5 text-primary"
          />
        </button>

        <div className="mr-auto text-left space-y-2">
          <div className="text-sm font-medium opacity-90">{task.title}</div>
          <div className="text-xs text-muted-foreground opacity-70 break-normal whitespace-normal">
            {task.desc}
          </div>

          <Button
            onClick={checkHandler}
            size="xs"
            variant={isChecked ? "destructive" : "default"}
            className="uppercase border-0 transition-all border-b-2 border-white/30 active:border-b active:scale-95 absolute bottom-1 -left-5 rounded-lg group-hover:opacity-100 opacity-0"
          >
            {isChecked ? (
              <HugeiconsIcon
                icon={Cancel02Icon}
                strokeWidth={3}
                fill="currentColor"
              />
            ) : (
              <HugeiconsIcon
                icon={Tick04Icon}
                strokeWidth={3}
                fill="currentColor"
              />
            )}
          </Button>
        </div>
      </LiveButton>
    </div>
  );
}
