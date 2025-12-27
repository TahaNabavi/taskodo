"use client";

import { DragOverlay } from "@dnd-kit/core";
import { createPortal } from "react-dom";

import { LiveButton } from "@/src/components/ui";
import type { Task } from "../types";

type Props = {
  activeTask: Task | null;
};

export function DragTaskOverlay({ activeTask }: Props) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <DragOverlay adjustScale={false}>
      {activeTask ? (
        <div className="w-[320px] pointer-events-none">
          <LiveButton className="squircle rounded-3xl w-full relative">
            <div className="mr-auto text-left">
              <div className="text-sm font-medium opacity-90">
                {activeTask.title}
              </div>
              <div className="text-xs text-muted-foreground opacity-70">
                {activeTask.desc}
              </div>
            </div>
          </LiveButton>
        </div>
      ) : null}
    </DragOverlay>,
    document.body,
  );
}
