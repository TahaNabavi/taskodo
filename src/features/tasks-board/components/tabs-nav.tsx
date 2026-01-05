"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Add02Icon } from "@hugeicons/core-free-icons";

import { cn } from "@/src/lib/utils";
import { TAB_CONTENT } from "../constants";

type Props = {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  viewIndex: number;
};

export function TabsNav({ activeTab, setActiveTab, viewIndex }: Props) {
  return (
    <div className="relative flex w-full">
      {TAB_CONTENT.map((tab, index) => {
        const isToday = index === viewIndex;

        return (
          <button
            key={tab.title}
            onClick={() => setActiveTab(index)}
            className="flex-1 flex items-center justify-center gap-3 h-8 xl:h-12 cursor-pointer group/btn"
          >
            {isToday && (
              <div>
                <span className="relative inline-flex">
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                      activeTab === index ? "bg-primary/80" : "bg-white/20",
                    )}
                  />
                  <span
                    className={cn(
                      "relative inline-flex h-3 w-3 rounded-full",
                      activeTab === index ? "bg-primary/80" : "bg-primary/30",
                    )}
                  />
                </span>
              </div>
            )}

            <span
              className={cn(
                "first-letter:uppercase transition-colors",
                activeTab === index
                  ? "text-white/80"
                  : "text-white/50 group-hover/btn:text-primary group-hover/btn:text-shadow-primary/20 group-hover/btn:text-shadow-sm",
              )}
            >
              {tab.title}
            </span>
          </button>
        );
      })}

      <button
        onClick={() => setActiveTab(-1)}
        data-tour="create-task"
        className="w-30 flex items-center justify-center gap-3 h-8 xl:h-12 cursor-pointer group/btn"
      >
        <span
          className={cn(
            "first-letter:uppercase transition-colors",
            activeTab === -1
              ? "text-primary"
              : "text-white/50 group-hover/btn:text-primary group-hover/btn:text-shadow-primary/20 group-hover/btn:text-shadow-sm",
          )}
        >
          <HugeiconsIcon
            icon={Add02Icon}
            fill="currentColor"
            strokeWidth={2.5}
          />
        </span>
      </button>
    </div>
  );
}
