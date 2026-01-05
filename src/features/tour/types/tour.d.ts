type TourStep = {
  id: string;
  title: string;
  desc: string;
  target: string; // CSS selector like "[data-tour='week-widget']"
  placement?: "top" | "bottom" | "left" | "right";
};
