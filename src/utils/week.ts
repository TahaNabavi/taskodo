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

export function getMostRecentWeekdayDate(baseDate: Date, weekday: WeekDays) {
  const base = new Date(baseDate);
  base.setHours(0, 0, 0, 0);

  const targetIndex = WEEK.indexOf(weekday);
  const baseIndex = base.getDay();

  const diff = (baseIndex - targetIndex + 7) % 7;
  const result = new Date(base);
  result.setDate(base.getDate() - diff);
  return result;
}
