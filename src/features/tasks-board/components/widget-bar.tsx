"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Add02Icon, Edit03Icon } from "@hugeicons/core-free-icons";

import { Button } from "@/src/components/ui/button";
import { TAB_CONTENT } from "../constants";
import { ManageTasksDialog } from "./manage-tasks-dialog";
import { MobileDayPickerDialog } from "./day-picker-dialog";
import { Dispatch, SetStateAction } from "react";

type Props = {
  weekOffset: number;
  setWeekOffset: Dispatch<SetStateAction<number>>;
  weekStart: Date;
  weekEnd: Date;
  activeDayIndex: number;
  setActiveDayIndex: (idx: number) => void;
  dayStats: { total: number; done: number }[];
  openCreate: () => void;
};

export function MobileWidgetBar({
  weekOffset,
  setWeekOffset,
  weekStart,
  weekEnd,
  activeDayIndex,
  setActiveDayIndex,
  dayStats,
  openCreate,
}: Props) {
  const dayTitle = TAB_CONTENT[activeDayIndex]?.title ?? "day";

  return (
    <div className="w-full flex items-center justify-between gap-2">
      {/* left widgets */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-xl"
          onClick={openCreate}
          aria-label="Create task"
        >
          <HugeiconsIcon icon={Add02Icon} />
        </Button>

        {/* Manage tasks */}
        <ManageTasksDialog
          trigger={
            <Button variant="ghost" size="icon" className="rounded-xl">
              <HugeiconsIcon icon={Edit03Icon} />
            </Button>
          }
        />
      </div>

      {/* day picker dialog */}
      <MobileDayPickerDialog
        activeDayIndex={activeDayIndex}
        setActiveDayIndex={setActiveDayIndex}
        stats={dayStats}
        weekOffset={weekOffset}
        setWeekOffset={setWeekOffset}
        weekStart={weekStart}
        weekEnd={weekEnd}
        trigger={
          <Button variant="secondary" className="rounded-xl capitalize px-4">
            {dayTitle}
          </Button>
        }
      />
    </div>
  );
}
