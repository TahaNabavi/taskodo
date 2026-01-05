"use client";
import { OnboardingDialog } from "@/src/features/onboarding";
import { TasksBoardFeature } from "@/src/features/tasks-board";
import { TourProvider } from "@/src/features/tour";
import {
  MOBILE_TASKS_BOARD_TOUR_STEPS,
  TASKS_BOARD_TOUR_STEPS,
} from "@/src/features/tour/constants";
import { useResponsive } from "@/src/hooks";

export default function Page() {
  const { isMobile } = useResponsive();

  return (
    <>
      <TourProvider
        routeId="tasks-board"
        steps={
          isMobile ? MOBILE_TASKS_BOARD_TOUR_STEPS : TASKS_BOARD_TOUR_STEPS
        }
      />
      <OnboardingDialog />
      <TasksBoardFeature />
    </>
  );
}
