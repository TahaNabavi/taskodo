"use client";

import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowTurnBackwardIcon,
  ArrowUp01Icon,
  DashboardSpeed01Icon,
  Edit03Icon,
} from "@hugeicons/core-free-icons";

import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { Separator } from "@/src/components/ui/separator";
import { ManageTasksDialog } from "./manage-tasks-dialog";
import { Dispatch, SetStateAction } from "react";
import { PATHS } from "@/src/routes/paths";
import { useRouter } from "next/navigation";

type Props = {
  activeTab: number;
  weekOffset: number;
  weekStart: Date;
  weekEnd: Date;
  setWeekOffset: Dispatch<SetStateAction<number>>;
};

export function WeekSidebar({
  activeTab,
  weekOffset,
  weekStart,
  weekEnd,
  setWeekOffset,
}: Props) {
  const router = useRouter();

  const weekStartDayOfMonth = weekStart.getDate();
  const weekEndDayOfMonth = weekEnd.getDate();

  return (
    <div className="w-12 absolute top-24 -right-12 flex flex-col items-center justify-center">
      {/* Week widget */}
      <div
        data-tour="week-widget"
        className={cn(
          "bg-zinc-900/95 w-full flex flex-col items-center justify-center transition-all py-4 gap-1",
          activeTab === -1 && "dark:text-white/30",
        )}
      >
        <div className="w-8 bg-white/10 rounded-full flex flex-col justify-between items-center py-1 gap-3">
          <Button
            variant="ghost"
            className="px-1 rounded-full delay-100"
            onClick={() => setWeekOffset((w) => w + 1)}
            aria-label="Next week"
            disabled={activeTab === -1}
          >
            <HugeiconsIcon icon={ArrowUp01Icon} />
          </Button>

          <Tooltip>
            <TooltipTrigger>
              <span className="text-xs font-extralight">
                {weekEndDayOfMonth}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{weekEnd.toLocaleDateString()}</p>
            </TooltipContent>
          </Tooltip>

          <span className="text-xs">-</span>

          <Tooltip>
            <TooltipTrigger>
              <span className="text-xs font-extralight">
                {weekStartDayOfMonth}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{weekStart.toLocaleDateString()}</p>
            </TooltipContent>
          </Tooltip>

          <Button
            variant="ghost"
            className="px-1 rounded-full delay-100"
            onClick={() => setWeekOffset((w) => w - 1)}
            aria-label="Previous week"
            disabled={activeTab === -1}
          >
            <HugeiconsIcon icon={ArrowDown01Icon} />
          </Button>
        </div>

        <AnimatePresence mode="popLayout">
          {weekOffset !== 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
            >
              <Button
                variant="ghost"
                className="dark:hover:bg-neutral-200/10 dark:hover:text-white px-2 rounded-full delay-100"
                onClick={() => setWeekOffset(0)}
                aria-label="Reset week"
              >
                <HugeiconsIcon icon={ArrowTurnBackwardIcon} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator />

      {/* Analytics */}
      <div data-tour="analytics" className="w-full bg-zinc-900/95 px-2 py-4">
        <Button
          variant="ghost"
          className="dark:hover:bg-neutral-200/10 dark:hover:text-white px-1 rounded-full delay-100"
          aria-label="Analytics"
          onClick={() => router.push(PATHS.ANALYSTICS)}
        >
          <HugeiconsIcon icon={DashboardSpeed01Icon} />
        </Button>
      </div>

      <Separator />

      {/* Manage tasks */}
      <div data-tour="manage-tasks" className="w-full bg-zinc-900/95 px-2 py-4">
        <ManageTasksDialog
          trigger={
            <Button
              variant="ghost"
              className="dark:hover:bg-neutral-200/10 dark:hover:text-white px-1 rounded-full delay-100"
              aria-label="Manage tasks"
            >
              <HugeiconsIcon icon={Edit03Icon} />
            </Button>
          }
        />
      </div>
    </div>
  );
}
