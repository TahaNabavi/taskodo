"use client";

import { motion } from "motion/react";
import { TAB_CONTENT } from "../constants";

type Props = {
  activeTab: number;
};

export function TabsHeaderHighlight({ activeTab }: Props) {
  return (
    <div className="flex w-full">
      {TAB_CONTENT.map((_, index) => (
        <div key={index} className="relative flex-1 h-8 xl:h-12">
          {activeTab === index && (
            <motion.div
              layoutId="active-tab"
              className="absolute inset-0 bg-zinc-900/95 shadow-[inset_0_-4px_15px_rgba(0,0,0,0.4)]"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
        </div>
      ))}

      <div className="relative w-30 h-8 xl:h-12">
        {activeTab === -1 && (
          <motion.div
            layoutId="active-tab"
            className="absolute inset-0 bg-zinc-900/95 shadow-[inset_0_-4px_15px_rgba(0,0,0,0.4)]"
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          />
        )}
      </div>
    </div>
  );
}
