import { WeekDays } from "@/src/types/common";

const WEEK: WeekDays[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export function toLocalDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getWeekdayDateInSameWeek(baseDate: Date, weekday: WeekDays) {
  const base = new Date(baseDate);
  base.setHours(0, 0, 0, 0);

  const baseIndex = base.getDay();
  const targetIndex = WEEK.indexOf(weekday);

  if (targetIndex === -1) {
    throw new Error(
      `Invalid weekday: "${weekday}". Must be one of: ${WEEK.join(", ")}`,
    );
  }

  const startOfWeek = new Date(base);
  startOfWeek.setDate(base.getDate() - baseIndex);

  const result = new Date(startOfWeek);
  result.setDate(startOfWeek.getDate() + targetIndex);

  return result;
}
