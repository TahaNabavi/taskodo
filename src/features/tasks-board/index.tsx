"use client";

import { useMemo, useState } from "react";
import { GooeySvgFilter } from "@/src/components/fancy";
import { useTasksBoardNavigation } from "./hooks/use-tasks-board-navigation";
import { useTasksStore } from "./stores/task.store";
import { TAB_CONTENT } from "./constants";
import { addDays, toLocalDateKey } from "@/src/utils";
import { WeekSidebar } from "./components/week-sidebar";
import { TabsHeaderHighlight } from "./components/tabs-header";
import { CreateTaskTab } from "./components/create-task-tab";
import { TabsNav } from "./components/tabs-nav";
import { MobileLineTabs } from "./components/line-tabs";
import { MobileWidgetBar } from "./components/widget-bar";
import { TaskLinesBoard } from "./components/tak-lines-board";

type Line = 1 | 2 | 3;

export function TasksBoardFeature() {
  const [mobileActiveLine, setMobileActiveLine] = useState<Line>(1);

  const {
    weekOffset,
    setWeekOffset,
    viewIndex,
    activeTab,
    setActiveTab,
    weekStart,
    weekEnd,
  } = useTasksBoardNavigation();

  const tasks = useTasksStore((s) => s.tasks);

  const dayStats = useMemo(() => {
    return TAB_CONTENT.map((tab, idx) => {
      const day = tab.title;
      const date = addDays(weekStart, idx);
      const dateKey = toLocalDateKey(date);

      const dayTasks = tasks.filter((t) => {
        if (!t.days.includes(day)) return false;
        if (t.weekly) return true;
        if (!t.startDateKey || !t.endDateKey) return false;
        return dateKey >= t.startDateKey && dateKey <= t.endDateKey;
      });

      const done = dayTasks.filter((t) =>
        t.checked.some((c) => c.date === dateKey),
      ).length;

      return { total: dayTasks.length, done };
    });
  }, [tasks, weekStart]);

  const mobileDayIndex = activeTab === -1 ? viewIndex : activeTab;

  const mobileDate = useMemo(
    () => addDays(weekStart, mobileDayIndex),
    [weekStart, mobileDayIndex],
  );
  const mobileDateKey = useMemo(() => toLocalDateKey(mobileDate), [mobileDate]);
  const mobileDay = TAB_CONTENT[mobileDayIndex]?.title;
  const mobileDayTasks = useMemo(() => {
    if (!mobileDay) return [];

    return tasks.filter((t) => {
      if (!t.days.includes(mobileDay)) return false;
      if (t.weekly) return true;

      if (!t.startDateKey || !t.endDateKey) return false;
      return mobileDateKey >= t.startDateKey && mobileDateKey <= t.endDateKey;
    });
  }, [tasks, mobileDay, mobileDateKey]);

  const mobileLineCounts = useMemo(() => {
    return {
      1: mobileDayTasks.filter((t) => t.line === 1).length,
      2: mobileDayTasks.filter((t) => t.line === 2).length,
      3: mobileDayTasks.filter((t) => t.line === 3).length,
    } as Record<1 | 2 | 3, number>;
  }, [mobileDayTasks]);

  return (
    <div className="relative w-dvw h-dvh flex justify-center p-0 md:p-4 lg:p-6 xl:p-8 font-calendas xl:text-base text-xs sm:text-sm">
      <GooeySvgFilter id="gooey-filter" strength={20} />

      <div className="w-full xl:w-4/5 relative lg:mt-10 xl:mt-16">
        {/* -------------------------------------------
            DESKTOP LAYOUT
        -------------------------------------------- */}
        <div className="hidden xl:block">
          <div
            className="absolute inset-0"
            style={{ filter: "url(#gooey-filter)" }}
          >
            <WeekSidebar
              activeTab={activeTab}
              weekOffset={weekOffset}
              weekStart={weekStart}
              weekEnd={weekEnd}
              setWeekOffset={setWeekOffset}
            />

            <TabsHeaderHighlight activeTab={activeTab} />

            <div className="w-full bg-zinc-900/95 text-muted-foreground shadow-[inset_0_10px_15px_rgba(0,0,0,0.4)] p-6">
              {activeTab === -1 ? (
                <CreateTaskTab />
              ) : (
                <TaskLinesBoard
                  activeDay={TAB_CONTENT[activeTab].title}
                  weekStart={weekStart}
                />
              )}
            </div>
          </div>

          <TabsNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            viewIndex={viewIndex}
          />
        </div>

        {/* -------------------------------------------
            MOBILE LAYOUT
        -------------------------------------------- */}
        <div className="xl:hidden">
          <div className="md:rounded-3xl h-screen md:h-[calc(100vh-40px)] lg:h-[calc(100vh-124px)] bg-zinc-900/95 p-4 space-y-4">
            {/* 1) LINE HEADER */}
            <MobileLineTabs
              activeLine={mobileActiveLine}
              setActiveLine={setMobileActiveLine}
              counts={mobileLineCounts}
            />

            {/* 2) WIDGET ROW + DAY PICKER */}
            <MobileWidgetBar
              weekOffset={weekOffset}
              setWeekOffset={setWeekOffset}
              weekStart={weekStart}
              weekEnd={weekEnd}
              activeDayIndex={activeTab}
              setActiveDayIndex={(i) => setActiveTab(i)}
              dayStats={dayStats}
              openCreate={() => setActiveTab(-1)}
            />

            {/* 3) MAIN CONTENT */}
            <div className="pt-2">
              {activeTab === -1 ? (
                <CreateTaskTab />
              ) : (
                <TaskLinesBoard
                  activeDay={TAB_CONTENT[activeTab].title}
                  weekStart={weekStart}
                  visibleLines={[mobileActiveLine]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
