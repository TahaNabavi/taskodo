/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/src/lib/utils";
import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Label } from "./label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

type FormItemContextValue = { id: string };
const FormItemContext = React.createContext<FormItemContextValue | null>(null);

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  if (!itemContext) {
    throw new Error("useFormField should be used within <FormItem>");
  }

  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

type FormLabelProps = React.ComponentProps<typeof Label>;

function FormLabel({ className, ...props }: FormLabelProps) {
  const { error, formItemId } = useFormField();

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive dark:text-neutral-300", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

/**
 * Base UI version of Slot:
 * - Accepts a single React element child (Input, SelectTrigger, etc.)
 * - Clones and injects id + aria props required for accessibility
 */

type FormControlProps<T extends React.ElementType = React.ElementType> = {
  children: React.ReactElement<React.ComponentPropsWithoutRef<T>, T>;
};

function FormControl<T extends React.ElementType>({
  children,
}: FormControlProps<T>) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  const ariaDescribedBy = !error
    ? formDescriptionId
    : `${formDescriptionId} ${formMessageId}`;

  // merge with existing child props (don't override if child already set them)
  const mergedProps = {
    id: (children.props as any).id ?? formItemId,
    "aria-describedby":
      (children.props as any)["aria-describedby"] ?? ariaDescribedBy,
    "aria-invalid": (children.props as any)["aria-invalid"] ?? !!error,
  };

  return React.cloneElement(children, (mergedProps as any));
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) return null;

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
