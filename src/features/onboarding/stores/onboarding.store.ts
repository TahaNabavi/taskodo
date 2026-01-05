import { create } from "zustand";
import { persist } from "zustand/middleware";

type OnboardingState = {
  onboardingSeen: boolean;

  setOnboardingSeen: (v: boolean) => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      onboardingSeen: false,

      setOnboardingSeen: (v) => set({ onboardingSeen: v }),
    }),
    {
      name: "taskodo-onboarding",
    },
  ),
);
