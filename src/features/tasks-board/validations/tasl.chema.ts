import z from "zod";
import { DAYS_ORDER } from "../constants";
import { WeekDays } from "@/src/types/common";

const ColorSchema = z.string().min(1);

export const taskSchema = z
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

export type TaskSchemaType = z.infer<typeof taskSchema>;
