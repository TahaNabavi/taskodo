"use client";

import { useMemo } from "react";
import type { Task } from "@/src/features/tasks-board/types";
import type { AnalyticsFilters } from "../lib/analytics";

import { Card } from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";

type Props = {
  tasks: Task[];
  filters: AnalyticsFilters;
  setFilters: (f: AnalyticsFilters) => void;
};

export function FiltersBar({ tasks, filters, setFilters }: Props) {
  const tags = useMemo(() => {
    const map = new Map<string, string>();
    tasks.forEach((t) => t.tags.forEach((tag) => map.set(tag.id, tag.label)));
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [tasks]);

  return (
    <Card className="rounded-3xl bg-black/20 border-black p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
        <div className="space-y-1">
          <Label className="text-white/70 text-xs font-extralight">Line</Label>
          <Select
            value={filters.line ? String(filters.line) : "all"}
            onValueChange={(v) =>
              setFilters({
                ...filters,
                line: v === "all" ? undefined : (Number(v) as never),
              })
            }
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue>All lines</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="1">Line 1</SelectItem>
              <SelectItem value="2">Line 2</SelectItem>
              <SelectItem value="3">Line 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-white/70 text-xs font-extralight">Tag</Label>
          <Select
            value={filters.tagId ?? "all"}
            onValueChange={(v) =>
              setFilters({ ...filters, tagId: v === "all" ? undefined : v! })
            }
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue>All tags</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {tags.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 pt-4 md:pt-0">
          <div className="flex items-center gap-2">
            <Switch
              checked={filters.completedOnly ?? false}
              onCheckedChange={(v) =>
                setFilters({ ...filters, completedOnly: v })
              }
            />
            <span className="text-sm text-white/60 font-extralight">
              Completed only
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
