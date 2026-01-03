"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/src/lib/utils";
import type { Task } from "../types";
import { TaskCard } from "./task-card";
import { MAIN_DIV_HEIGHT_CLASS } from "../constants";

export type Line = 1 | 2 | 3;

type Props = {
  line: Line;
  title: string;
  tasks: Task[];
  dateKey: string;
};

export function LineColumn({ line, title, tasks, dateKey }: Props) {
  const { setNodeRef } = useDroppable({ id: `line-${line}` });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-full flex flex-col rounded-4xl squircle bg-black/30 p-3",
        "border border-black dark:border-white/5",
        "xl:flex-1  overflow-y-scroll",
        MAIN_DIV_HEIGHT_CLASS,
      )}
    >
      <div className="mb-3 text-xs font-extralight text-primary">{title}</div>

      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2 h-auto transition-all">
          <AnimatePresence mode="popLayout">
            {tasks.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
                transition={{ duration: 0.06 * i, ease: "easeOut" }}
              >
                <TaskCard task={t} dateKey={dateKey} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </div>
  );
}
