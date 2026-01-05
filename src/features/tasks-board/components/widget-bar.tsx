"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add02Icon,
  DashboardSpeed01Icon,
  Edit03Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/src/components/ui/button";
import { TAB_CONTENT } from "../constants";
import { ManageTasksDialog } from "./manage-tasks-dialog";
import { MobileDayPickerDialog } from "./day-picker-dialog";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/src/routes/paths";

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
  const router = useRouter();

  const dayTitle =
    activeDayIndex === -1
      ? "Create Task"
      : (TAB_CONTENT[activeDayIndex]?.title ?? "unknown");

  return (
    <div className="w-full flex items-center justify-between gap-2">
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
          <Button
            data-tour="mb:week-widget"
            variant="secondary"
            className="rounded-xl capitalize px-4 bg-secondary!"
          >
            {dayTitle}
          </Button>
        }
      />

      {/* left widgets */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="icon"
          data-tour="mb:analytics"
          className="rounded-xl"
          onClick={() => router.push(PATHS.ANALYSTICS)}
          aria-label="Create task"
        >
          <HugeiconsIcon icon={DashboardSpeed01Icon} />
        </Button>

        <Button
          variant="secondary"
          size="icon"
          data-tour="mb:create-task"
          className="rounded-xl"
          onClick={openCreate}
          aria-label="Create task"
        >
          <HugeiconsIcon icon={Add02Icon} />
        </Button>

        {/* Manage tasks */}
        <ManageTasksDialog
          trigger={
            <Button
              data-tour="mb:manage-tasks"
              variant="ghost"
              size="icon"
              className="rounded-xl"
            >
              <HugeiconsIcon icon={Edit03Icon} />
            </Button>
          }
        />
      </div>
    </div>
  );
}
