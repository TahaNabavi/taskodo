"use client";

import { addDays, startOfWeekSunday } from "@/src/utils";
import { useEffect, useMemo, useState } from "react";

export function useTasksBoardNavigation() {
  const [weekOffset, setWeekOffset] = useState(0);

  const todayIndex = new Date().getDay() % 7;
  const [activeTab, setActiveTab] = useState<number>(todayIndex);

  const { weekStart, weekEnd } = useMemo(() => {
    const base = new Date();
    const start = startOfWeekSunday(addDays(base, weekOffset * 7));
    const end = addDays(start, 6);
    return { weekStart: start, weekEnd: end };
  }, [weekOffset]);

  const viewIndex = useMemo(() => {
    return weekOffset === 0 ? todayIndex : -999;
  }, [weekOffset, todayIndex]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Tabs
      if (e.key === "ArrowRight") setActiveTab((p) => (p >= 6 ? -1 : p + 1));
      if (e.key === "ArrowLeft") setActiveTab((p) => (p <= -1 ? 6 : p - 1));
      if (e.key === "+") setActiveTab(-1);

      // Week navigation
      if (e.key === "ArrowUp") setWeekOffset((w) => w + 1);
      if (e.key === "ArrowDown") setWeekOffset((w) => w - 1);
      if (e.key === "Home") setWeekOffset(0);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return {
    weekOffset,
    setWeekOffset,

    todayIndex,
    viewIndex,

    activeTab,
    setActiveTab,

    weekStart,
    weekEnd,
  };
}
