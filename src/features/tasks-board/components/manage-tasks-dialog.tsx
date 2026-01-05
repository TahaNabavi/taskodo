"use client";

import type { DateRange } from "react-day-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete03Icon, Edit03Icon } from "@hugeicons/core-free-icons";

import type { WeekDays } from "@/src/types/common";
import { cn } from "@/src/lib/utils";
import { toLocalDateKey } from "@/src/utils";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";

import { Calendar } from "@/src/components/ui/calendar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

import { useTasksStore } from "../stores/task.store";
import type { Tag, Task } from "../types";
import { COLOR_SWATCH_CLASS, DAYS_ORDER, TASK_COLORS } from "../constants";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { taskSchema, TaskSchemaType } from "../validations/tasl.chema";

/* -----------------------------
   Helpers
------------------------------ */
type Line = 1 | 2 | 3;

const DEFAULT_TAGS: Tag[] = [];

function fromLocalDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function taskToFormValues(task: Task): TaskSchemaType {
  return {
    title: task.title ?? "",
    desc: task.desc ?? "",
    weekly: task.weekly ?? true,
    days: (task.days as never) ?? [],
    range: task.weekly
      ? { from: undefined, to: undefined }
      : {
          from: task.startDateKey
            ? fromLocalDateKey(task.startDateKey)
            : undefined,
          to: task.endDateKey ? fromLocalDateKey(task.endDateKey) : undefined,
        },
    effort: (task.effort as never) ?? 1,
    line: (task.line ?? 1) as Line,
    color: task.color ?? "zinc",
    tags: task.tags ?? DEFAULT_TAGS,
  };
}

/* -----------------------------
   Confirm Delete
------------------------------ */
function ConfirmDeleteDialog({
  task,
  children,
}: {
  task: Task;
  children: ReactNode;
}) {
  const removeTask = useTasksStore((s) => s.removeTask);

  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete task?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-semibold">{task.title}</span>. This cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => removeTask(task.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* -----------------------------
   Edit Task Dialog
------------------------------ */
function EditTaskDialog({
  task,
  open,
  onOpenChange,
}: {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const updateTask = useTasksStore((s) => s.updateTask);

  const form = useForm<TaskSchemaType>({
    resolver: zodResolver(taskSchema),
    defaultValues: taskToFormValues(task),
    mode: "onChange",
  });

  useEffect(() => {
    form.reset(taskToFormValues(task));
  }, [form, task]);

  const weekly = useWatch({ control: form.control, name: "weekly" });
  const days = useWatch({ control: form.control, name: "days" });
  const line = useWatch({ control: form.control, name: "line" });

  const toggleDay = (day: WeekDays) => {
    const next = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];
    form.setValue("days", next, { shouldValidate: true });
  };

  const onSubmit = (values: TaskSchemaType) => {
    const startDateKey =
      !values.weekly && values.range?.from
        ? toLocalDateKey(values.range.from)
        : undefined;

    const endDateKey =
      !values.weekly && values.range?.to
        ? toLocalDateKey(values.range.to)
        : undefined;

    updateTask(task.id, {
      title: values.title.trim(),
      desc: values.desc.trim(),
      weekly: values.weekly,
      days: values.days,
      line: values.line,
      effort: values.effort,
      color: values.color,
      tags: values.tags ?? [],
      ...(values.weekly
        ? { startDateKey: undefined, endDateKey: undefined }
        : { startDateKey, endDateKey }),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="xl:col-span-2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="desc"
                  render={({ field }) => (
                    <FormItem className="xl:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea className="rounded-xl min-h-24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <div className="flex items-start justify-between gap-6">
                <div className="space-y-1">
                  <Label>Weekly repeat</Label>
                  <p className="text-sm text-muted-foreground">
                    On = repeats forever. Off = active only in a date range.
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="weekly"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="days"
                render={() => (
                  <FormItem className="mt-3 gap-3">
                    <div className="flex items-center justify-between">
                      <FormLabel>Days</FormLabel>
                      <span className="text-xs text-muted-foreground">
                        {days.length} selected
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full">
                      {DAYS_ORDER.map((d) => {
                        const active = days.includes(d);
                        return (
                          <Button
                            key={d}
                            type="button"
                            variant={active ? "default" : "outline"}
                            className={cn(
                              "rounded-xl capitalize",
                              !active && "bg-transparent",
                            )}
                            onClick={() => toggleDay(d)}
                          >
                            {d.slice(0, 3)}
                          </Button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!weekly && (
                <FormField
                  control={form.control}
                  name="range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date range</FormLabel>
                      <div className="flex justify-center bg-neutral-800 rounded-3xl p-2">
                        <Calendar
                          mode="range"
                          selected={field.value as DateRange | undefined}
                          onSelect={(r) => field.onChange(r)}
                          numberOfMonths={2}
                          className="w-full rounded-2xl"
                          initialFocus
                        />
                      </div>

                      {form.formState.errors.range?.message ? (
                        <p className="text-sm text-destructive">
                          {String(form.formState.errors.range.message)}
                        </p>
                      ) : null}
                    </FormItem>
                  )}
                />
              )}

              <Separator />

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="line"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Line</FormLabel>
                      <Select
                        value={String(line)}
                        onValueChange={(v) => field.onChange(Number(v) as Line)}
                      >
                        <SelectTrigger className="rounded-xl w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Line 1</SelectItem>
                          <SelectItem value="2">Line 2</SelectItem>
                          <SelectItem value="3">Line 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="effort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Effort</FormLabel>

                      <Select
                        value={String(field.value)}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <SelectTrigger className="rounded-xl w-full">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="1">1 (Easy)</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="5">5 (Hard)</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="rounded-xl w-full">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-3 w-3 rounded-full",
                                COLOR_SWATCH_CLASS[
                                  field.value as keyof typeof COLOR_SWATCH_CLASS
                                ],
                              )}
                            />
                            <SelectValue>Pick a color</SelectValue>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {TASK_COLORS.map((c) => (
                            <SelectItem key={c.value} value={c.value}>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "h-3 w-3 rounded-full",
                                    COLOR_SWATCH_CLASS[
                                      c.value as keyof typeof COLOR_SWATCH_CLASS
                                    ],
                                  )}
                                />
                                <span>{c.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!form.formState.isValid}>
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/* -----------------------------
   Manage Tasks Dialog
------------------------------ */
export function ManageTasksDialog({ trigger }: { trigger: ReactNode }) {
  const tasks = useTasksStore((s) => s.tasks);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter((t) => {
      return (
        t.title.toLowerCase().includes(q) ||
        (t.desc ?? "").toLowerCase().includes(q) ||
        (t.tags ?? []).some((tag) => tag.label.toLowerCase().includes(q))
      );
    });
  }, [tasks, query]);

  const editingTask = useMemo(
    () => (editingId ? (tasks.find((t) => t.id === editingId) ?? null) : null),
    [editingId, tasks],
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{trigger}</DialogTrigger>

        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage Tasks</DialogTitle>
          </DialogHeader>

          <div className="flex items-center gap-3">
            <Input
              placeholder="Search by title, description, or tag..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-xl"
            />
            <Badge variant="secondary" className="rounded-xl">
              {filtered.length} / {tasks.length}
            </Badge>
          </div>

          <Separator />

          <div className="max-h-[55vh] overflow-auto space-y-2 pr-1">
            {filtered.length === 0 ? (
              <div className="text-sm text-muted-foreground py-10 text-center">
                No tasks match your search.
              </div>
            ) : (
              filtered
                .slice()
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start justify-between gap-3 rounded-2xl border border-border p-3 group/btn"
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{task.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {task.desc}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-md w-4",
                            COLOR_SWATCH_CLASS[task.color as never],
                          )}
                        ></Badge>
                        <Badge variant="outline" className="rounded-xl">
                          {task.weekly ? "Weekly" : "Range"}
                        </Badge>
                        <Badge variant="outline" className="rounded-xl">
                          Line {task.line}
                        </Badge>
                        {(task.days ?? []).map((d) => (
                          <Badge
                            key={d}
                            variant="secondary"
                            className="rounded-xl capitalize"
                          >
                            {d.slice(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 xl:opacity-0 group-hover/btn:opacity-100 transition-all">
                      {/* Delete */}
                      <ConfirmDeleteDialog task={task}>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="rounded-xl"
                        >
                          <HugeiconsIcon icon={Delete03Icon} />
                        </Button>
                      </ConfirmDeleteDialog>

                      {/* Edit */}
                      <Button
                        variant="default"
                        size="icon"
                        className="rounded-xl bg-primary/40!"
                        onClick={() => setEditingId(task.id)}
                      >
                        <HugeiconsIcon icon={Edit03Icon} />
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editingTask ? (
        <EditTaskDialog
          task={editingTask}
          open={Boolean(editingId)}
          onOpenChange={(v) => {
            if (!v) setEditingId(null);
          }}
        />
      ) : null}
    </>
  );
}
