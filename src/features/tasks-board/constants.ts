import type { WeekDays } from "@/src/types/common";

export const TAB_CONTENT = [
  { title: "sunday" },
  { title: "monday" },
  { title: "tuesday" },
  { title: "wednesday" },
  { title: "thursday" },
  { title: "friday" },
  { title: "saturday" },
] as const satisfies readonly { title: WeekDays }[];

export const DAYS_ORDER: WeekDays[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const TASK_COLORS = [
  { value: "zinc", label: "Zinc" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "amber", label: "Amber" },
  { value: "yellow", label: "Yellow" },
  { value: "lime", label: "Lime" },
  { value: "green", label: "Green" },
  { value: "emerald", label: "Emerald" },
  { value: "teal", label: "Teal" },
  { value: "cyan", label: "Cyan" },
  { value: "sky", label: "Sky" },
  { value: "blue", label: "Blue" },
  { value: "indigo", label: "Indigo" },
  { value: "violet", label: "Violet" },
  { value: "purple", label: "Purple" },
  { value: "fuchsia", label: "Fuchsia" },
  { value: "pink", label: "Pink" },
  { value: "rose", label: "Rose" },
] as const;

export const COLOR_SWATCH_CLASS = {
  zinc: "bg-zinc-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
  yellow: "bg-yellow-500",
  lime: "bg-lime-500",
  green: "bg-green-500",
  emerald: "bg-emerald-500",
  teal: "bg-teal-500",
  cyan: "bg-cyan-500",
  sky: "bg-sky-500",
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  purple: "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  pink: "bg-pink-500",
  rose: "bg-rose-500",
};
