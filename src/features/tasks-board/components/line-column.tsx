"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion } from "motion/react";

import type { Task } from "../types";
import { TaskCard } from "./task-card";

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
      className="flex-1 rounded-4xl border border-black squircle bg-black/30 p-3 h-[calc(100vh-290px)]! overflow-y-scroll"
    >
      <div className="mb-3 text-xs font-semibold text-primary">{title}</div>

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
                transition={{ duration: 0.1 * i, ease: "easeOut" }}
              >
                <TaskCard key={t.id} task={t} dateKey={dateKey} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </div>
  );
}
