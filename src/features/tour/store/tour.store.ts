import { create } from "zustand";
import { persist } from "zustand/middleware";

export type RouteId = "tasks-board" | "analytics";

export type TourStep = {
  id: string;
  title: string;
  desc: string;
  target: string;
  placement: "top" | "right" | "bottom" | "left";
};

type TourState = {
  tourSeen: boolean;
  isOpen: boolean;
  index: number;

  toursSeen: Record<RouteId, boolean>;
  currentRoute: RouteId | null;
  currentSteps: TourStep[];

  start: () => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  setIndex: (i: number) => void;
  markSeen: () => void;

  startRouteTour: (route: RouteId, steps: TourStep[]) => void;
  markRouteAsSeen: (route: RouteId) => void;
  hasSeenRouteTour: (route: RouteId) => boolean;
  resetAllTours: () => void;
};

// Default tours seen state
const defaultToursSeen: Record<RouteId, boolean> = {
  "tasks-board": false,
  analytics: false,
};

export const useTourStore = create<TourState>()(
  persist(
    (set, get) => ({
      tourSeen: false,
      isOpen: false,
      index: 0,

      toursSeen: defaultToursSeen,
      currentRoute: null,
      currentSteps: [],

      start: () => {
        console.log("Tour started (backward compatible)");
        set({ isOpen: true, index: 0 });
      },

      close: () => {
        console.log("Tour closed");
        set({
          isOpen: false,
          currentRoute: null,
          currentSteps: [],
        });
      },

      next: () => {
        const { index, currentSteps } = get();
        if (index < currentSteps.length - 1) {
          set({ index: index + 1 });
        } else {
          const { currentRoute } = get();
          console.log("Tour finished for route:", currentRoute);

          if (currentRoute) {
            set((state) => ({
              isOpen: false,
              currentRoute: null,
              currentSteps: [],
              toursSeen: { ...state.toursSeen, [currentRoute]: true },
              tourSeen: true, // For backward compatibility
            }));
          } else {
            set({
              isOpen: false,
              tourSeen: true,
            });
          }
        }
      },

      prev: () =>
        set((s) => ({
          index: Math.max(0, s.index - 1),
        })),

      setIndex: (i) => set({ index: i }),

      markSeen: () => {
        console.log("Tour marked as seen");
        set({ tourSeen: true });
      },

      startRouteTour: (route: RouteId, steps: TourStep[]) => {
        console.log(
          `Starting tour for route: ${route} with ${steps.length} steps`,
        );
        set({
          isOpen: true,
          index: 0,
          currentRoute: route,
          currentSteps: steps,
        });
      },

      markRouteAsSeen: (route: RouteId) => {
        console.log(`Route ${route} marked as seen`);
        set((state) => ({
          toursSeen: { ...state.toursSeen, [route]: true },
          tourSeen: true, // For backward compatibility
        }));
      },

      hasSeenRouteTour: (route: RouteId) => {
        const state = get();
        return state.toursSeen[route] || false;
      },

      resetAllTours: () => {
        console.log("All tours reset");
        set({
          toursSeen: defaultToursSeen,
          tourSeen: false,
          isOpen: false,
          index: 0,
          currentRoute: null,
          currentSteps: [],
        });
      },
    }),
    {
      name: "taskodo-tour",
      partialize: (state) => ({
        tourSeen: state.tourSeen,
        toursSeen: state.toursSeen,
      }),
    },
  ),
);
