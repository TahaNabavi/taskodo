"use client";

import { useEffect } from "react";
import { RouteId, useTourStore } from "./store/tour.store";
import { TourOverlay } from "./components/tour-overlay";

interface TourProviderProps {
  steps: TourStep[];
  routeId: RouteId;
}

export function TourProvider({ steps, routeId }: TourProviderProps) {
  const { toursSeen, startRouteTour, markRouteAsSeen } = useTourStore();

  useEffect(() => {
    const routeSeen = toursSeen[routeId] || false;

    if (!routeSeen && steps.length > 0) {
      const timer = setTimeout(() => {
        startRouteTour(routeId, steps as never);
        markRouteAsSeen(routeId);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [routeId, steps, toursSeen, startRouteTour, markRouteAsSeen]);

  return <TourOverlay />;
}
