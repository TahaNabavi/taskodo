"use client";

import { useMemo, useState } from "react";

import { useOnboardingStore } from "./stores/onboarding.store";
import { ONBOARDING_STEPS } from "./lib/onboarding-copy";
import { TEMPLATE_PACKS } from "./lib/template-packs";
import { createTasksFromTemplate } from "./lib/apply-template";

import { useTasksStore } from "@/src/features/tasks-board/stores/task.store";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import { cn } from "@/src/lib/utils";

export function OnboardingDialog() {
  const onboardingSeen = useOnboardingStore((s) => s.onboardingSeen);
  const setOnboardingSeen = useOnboardingStore((s) => s.setOnboardingSeen);

  const tasks = useTasksStore((s) => s.tasks);
  const setTasks = useTasksStore((s) => s.setTasks);

  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");

  const open = !onboardingSeen;

  const hasTasks = useMemo(() => tasks.length > 0, [tasks]);

  function close() {
    setOnboardingSeen(true);
  }

  function next() {
    setStep((s) => Math.min(2, s + 1));
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function applyTemplate() {
    const pack = TEMPLATE_PACKS.find((p) => p.id === selectedTemplate);
    if (!pack) return;

    const created = createTasksFromTemplate(pack.tasks);
    const nextTasks = hasTasks ? [...tasks, ...created] : created;

    setTasks(nextTasks as never);
    close();
  }

  const content = ONBOARDING_STEPS[step];

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) close();
      }}
    >
      <DialogContent className="z-1000">
        <DialogHeader>
          <DialogTitle className="text-white/80 text-xl">
            {content.title}
          </DialogTitle>

          <p className="text-sm text-white/50 font-extralight">
            {content.desc}
          </p>
        </DialogHeader>

        <Separator className="opacity-20" />

        <div className="space-y-4">
          <ul className="list-disc pl-5 space-y-2 text-sm text-white/60 font-extralight">
            {content.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>

          {/* Template Step */}
          {step === 2 && (
            <div className="space-y-3 pt-2">
              <p className="text-xs text-white/40 font-extralight">
                Choose a starter workflow. You can edit or delete everything
                later.
              </p>

              <div className="grid grid-cols-1 gap-2">
                {TEMPLATE_PACKS.map((p) => {
                  const active = p.id === selectedTemplate;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedTemplate(p.id)}
                      className={cn(
                        "text-left rounded-2xl border p-3 transition-all",
                        "bg-white/5 border-white/10 hover:bg-white/10",
                        active && "border-primary/40 bg-primary/10",
                      )}
                    >
                      <div className="text-sm text-white/80">{p.title}</div>
                      <div className="text-xs text-white/40 font-extralight">
                        {p.desc}
                      </div>

                      <div className="mt-2 text-[10px] text-white/30 font-extralight">
                        {p.tasks.length} tasks
                      </div>
                    </button>
                  );
                })}
              </div>

              <Card className="rounded-2xl bg-white/5 border-white/10 p-3">
                <div className="text-xs text-white/40 font-extralight">
                  The workflow will be {hasTasks ? "added to" : "used as"} your
                  board.
                </div>
              </Card>
            </div>
          )}
        </div>

        <Separator className="opacity-20" />

        <div className="flex items-center justify-between">
          <Button variant="ghost" className="rounded-xl" onClick={close}>
            Skip
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={back}
              disabled={step === 0}
            >
              Back
            </Button>

            {step < 2 ? (
              <Button className="rounded-xl" onClick={next}>
                Next
              </Button>
            ) : (
              <Button className="rounded-xl" onClick={applyTemplate}>
                Apply workflow
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
