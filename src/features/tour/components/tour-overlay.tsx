"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";
import { useTourStore } from "../store/tour.store";

type Rect = { x: number; y: number; w: number; h: number };

function getRect(el: HTMLElement): Rect {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

export function TourOverlay() {
  const { isOpen, index, currentSteps, next, prev, close, markSeen, setIndex } =
    useTourStore();

  const step = currentSteps[index];

  const [rect, setRect] = useState<Rect | null>(null);

  const isLast = index === currentSteps.length - 1;

  useEffect(() => {
    if (!isOpen || !step) return;

    const el = document.querySelector(step.target) as HTMLElement | null;
    if (!el) {
      // If element missing, skip forward
      if (!isLast) setIndex(index + 1);
      else close();
      return;
    }

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const update = () => setRect(getRect(el));
    update();

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [isOpen, step, index, isLast, close, setIndex]);

  const tooltipStyle = useMemo(() => {
    if (!rect || !step) return {};

    const gap = 12;
    const placement = step.placement ?? "bottom";

    const base = {
      position: "fixed" as const,
      zIndex: 1000,
      maxWidth: "320px",
    };
    const maxWidth = 320;

    if (placement === "bottom") {
      return { ...base, left: rect.x, top: rect.y + rect.h + gap };
    }
    if (placement === "top") {
      return { ...base, left: rect.x, top: rect.y - gap };
    }
    if (placement === "left") {
      return { ...base, left: rect.x - maxWidth - gap, top: rect.y };
    }
    return { ...base, left: rect.x + rect.w + gap, top: rect.y };
  }, [rect, step]);

  if (!isOpen || !rect || !step) return null;

  const finish = () => {
    markSeen();
    close();
  };

  const onNext = () => {
    if (isLast) finish();
    else next();
  };

  return createPortal(
    <div className="fixed inset-0 z-10">
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* spotlight hole using box-shadow */}
      <div
        className="absolute rounded-2xl transition-all"
        style={{
          left: rect.x - 6,
          top: rect.y - 6,
          width: rect.w + 12,
          height: rect.h + 12,
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.62)",
        }}
      />

      {/* tooltip */}
      <div style={tooltipStyle}>
        <div className="rounded-3xl border border-border bg-card backdrop-blur-xl p-4 shadow-xl">
          <div className="text-white/90 text-sm font-semibold">
            {step.title}
          </div>
          <div className="text-white/60 text-xs font-extralight mt-1">
            {step.desc}
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button
              variant="ghost"
              className="rounded-xl text-white/70"
              onClick={finish}
            >
              Skip
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className={cn("rounded-xl")}
                onClick={prev}
                disabled={index === 0}
              >
                Back
              </Button>

              <Button className="rounded-xl" onClick={onNext}>
                {isLast ? "Done" : "Next"}
              </Button>
            </div>
          </div>

          <div className="mt-3 text-[10px] text-white/30 font-extralight">
            Step {index + 1} / {currentSteps.length}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
