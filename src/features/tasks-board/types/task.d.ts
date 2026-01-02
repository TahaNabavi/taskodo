import { WeekDays } from "@/src/types/common";
import { Tag } from "./tag";
type Line = 1 | 2 | 3;
export type Task = {
  id: string;
  title: string;
  desc: string;
  tags: Tag[];
  color: string;
  line: 1 | 2 | 3;
  order: number;
  checked: { date: string; late: boolean; early: boolean }[];
  startDateKey?: string;
  endDateKey?: string;
  visibleLines?: Line[];
} & ({ weekly: true; days: WeekDays[] } | { weekly: false; days: string[] });
