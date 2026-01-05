import { WeekDays } from "@/src/types/common";
import { Tag } from "./tag";

export type Line = 1 | 2 | 3;
export type Effort = 1 | 2 | 3 | 4 | 5;

export type Task = {
  id: string;
  title: string;
  desc: string;
  tags: Tag[];
  color: string;
  line: Line;
  effort?: Effort;
  order: number;
  checked: { date: string; late: boolean; early: boolean }[];
  startDateKey?: string;
  endDateKey?: string;
  visibleLines?: Line[];
} & ({ weekly: true; days: WeekDays[] } | { weekly: false; days: string[] });
