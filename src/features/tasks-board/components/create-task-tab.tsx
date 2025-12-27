"use client";

import * as React from "react";
import { z } from "zod";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import type { WeekDays } from "@/src/types/common";
import { cn } from "@/src/lib/utils";
import { toLocalDateKey } from "@/src/utils";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Calendar } from "@/src/components/ui/calendar";
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
import { Separator } from "@/src/components/ui/separator";
import { COLOR_SWATCH_CLASS, DAYS_ORDER, TASK_COLORS } from "../constants";

type Line = 1 | 2 | 3;

const ColorSchema = z.string().min(1);

const schema = z
  .object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    desc: z.string().max(250, "Description is too long"),
    weekly: z.boolean(),
    days: z
      .array(z.enum(DAYS_ORDER as [WeekDays, ...WeekDays[]]))
      .min(1, "Pick at least one day"),
    range: z
      .object({
        from: z.date().optional(),
        to: z.date().optional(),
      })
      .optional(),
    line: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    color: ColorSchema,
    tags: z.array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
      }),
    ),
  })
  .superRefine((v, ctx) => {
    if (!v.weekly) {
      const from = v.range?.from;
      const to = v.range?.to;
      if (!from || !to) {
        ctx.addIssue({
          code: "custom",
          path: ["range"],
          message: "Pick a date range",
        });
      }
    }
  });

type FormValues = z.infer<typeof schema>;

const DEFAULT_TAGS: Tag[] = [];

export function CreateTaskTab() {
  const createTask = useTasksStore((s) => s.newTask);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      desc: "",
      weekly: true,
      days: [],
      range: { from: undefined, to: undefined },
      line: 1,
      color: "zinc",
      tags: DEFAULT_TAGS,
    },
    mode: "onChange",
  });

  const weekly = useWatch({ control: form.control, name: "weekly" });
  const days = useWatch({ control: form.control, name: "days" });
  const line = useWatch({ control: form.control, name: "line" });
  const range = useWatch({ control: form.control, name: "range" });

  const toggleDay = (day: WeekDays) => {
    const next = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];
    form.setValue("days", next, { shouldValidate: true });
  };

  const rangeLabel =
    range?.from && range?.to
      ? `${format(range.from, "PPP")} → ${format(range.to, "PPP")}`
      : "Pick date range";

  const onSubmit = (values: FormValues) => {
    const id = crypto.randomUUID();

    const startDateKey =
      !values.weekly && values.range?.from
        ? toLocalDateKey(values.range.from)
        : undefined;

    const endDateKey =
      !values.weekly && values.range?.to
        ? toLocalDateKey(values.range.to)
        : undefined;

    const task: Task = {
      id,
      title: values.title.trim(),
      desc: values.desc.trim(),

      tags: values.tags ?? [],
      color: values.color,

      weekly: values.weekly,
      days: values.days,

      line: values.line,
      order: 9999,
      checked: [],

      ...(values.weekly ? {} : { startDateKey, endDateKey }),
    };

    createTask(task);

    form.reset({
      title: "",
      desc: "",
      weekly: true,
      days: [todayWeekDay()],
      range: { from: undefined, to: undefined },
      line: 1,
      color: "zinc",
      tags: DEFAULT_TAGS,
    });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full rounded-2xl bg-black/20 border-black">
            <CardHeader className="">
              <CardTitle className="text-white/80 text-2xl">
                Create Task
              </CardTitle>
              <CardDescription className="text-white/60">
                Select weekdays always. If not weekly, choose the date window
                where it’s active.
              </CardDescription>
            </CardHeader>

            <Separator className="bg-white/20" />

            <CardContent className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <div className="p-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Gym / Study / Report..."
                            className="rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="desc"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            className="rounded-lg min-h-24"
                            placeholder="Optional..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Section: Schedule */}
              <div className="p-1">
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-1">
                    <Label className="text-white/80">Weekly repeat</Label>
                    <p className="text-sm text-white/50">
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

                {/* Days (always visible) */}
                <FormField
                  control={form.control}
                  name="days"
                  render={() => (
                    <FormItem className="mt-3 gap-3">
                      <div className="flex items-center justify-between">
                        <FormLabel>Days</FormLabel>
                        <span className="text-xs text-white/50">
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
                                "rounded-xl capitalize dark:text-white/80 flex hover:text-white",
                                !active && "border-primary! bg-transparent!",
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
                      <FormItem className="mt-4">
                        <FormLabel>Date range</FormLabel>

                        <Popover>
                          <PopoverTrigger>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full justify-start rounded-xl",
                                !(range?.from && range?.to) && "text-white/50",
                              )}
                            >
                              {rangeLabel}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="p-0" align="start">
                            <Calendar
                              mode="range"
                              selected={field.value as DateRange | undefined}
                              onSelect={(r) => field.onChange(r)}
                              numberOfMonths={2}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        {form.formState.errors.range?.message ? (
                          <p className="text-sm text-destructive">
                            {String(form.formState.errors.range.message)}
                          </p>
                        ) : null}
                      </FormItem>
                    )}
                  />
                )}

                <Separator className="opacity-20 my-2" />

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-white/80">
                    Placement
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name="line"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Line</FormLabel>
                          <Select
                            value={String(line)}
                            onValueChange={(v) =>
                              field.onChange(Number(v) as Line)
                            }
                          >
                            <SelectTrigger className="rounded-xl">
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
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>

                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="rounded-xl">
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "h-3 w-3 rounded-full",
                                    COLOR_SWATCH_CLASS[
                                      field.value as keyof typeof COLOR_SWATCH_CLASS
                                    ],
                                  )}
                                />
                                <SelectValue>Pick a color </SelectValue>
                              </div>
                            </SelectTrigger>

                            <SelectContent>
                              {TASK_COLORS.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  <div className="flex items-center gap-2">
                                    {/* optional little swatch */}
                                    <span
                                      className={cn(
                                        "h-3 w-3 rounded-full",
                                        `bg-${c.value}-500`,
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

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      className="w-full md:w-auto rounded-xl"
                      disabled={!form.formState.isValid}
                    >
                      Create task
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-white/40">
                  Weekly tasks are always active. Non-weekly tasks only appear
                  between the selected range.
                </p>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
