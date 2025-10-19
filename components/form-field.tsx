import React from "react";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  ShadcnFormField,
} from "./ui/form";
import {
  Control,
  ControllerRenderProps,
  ControllerFieldState,
  FieldPath,
  FieldValues,
} from "react-hook-form";

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  required?: boolean;
  children: (
    field: ControllerRenderProps<TFieldValues, TName>,
    fieldState: ControllerFieldState
  ) => React.ReactNode;
}

export default function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  required,
  description,
  children,
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <ShadcnFormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && (
            <div className="flex items-start gap-1">
              <label htmlFor={name} className="text-s-regular">
                {label}
              </label>
              {required && (
                <span className="text-destructive h-fit flex items-start">
                  *
                </span>
              )}
            </div>
          )}
          <FormControl>{children(field, fieldState)}</FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
