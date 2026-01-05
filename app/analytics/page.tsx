import { AnalyticsPage } from "@/src/features/analytics";
import { TourProvider } from "@/src/features/tour";
import { ANALYTICS_TOUR_STEPS } from "@/src/features/tour/constants";

export default function Page() {
  return (
    <>
      <TourProvider steps={ANALYTICS_TOUR_STEPS} routeId="analytics" />
      <AnalyticsPage />
    </>
  );
}
