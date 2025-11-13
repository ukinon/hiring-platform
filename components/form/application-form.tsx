"use client";

import { JobConfig } from "@/types";
import React, { useMemo } from "react";
import JobFormInput from "../job/job-form-input";
import { generateFormSchema } from "@/lib/schema/form-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import FormField from "@/components/form-field";
import { FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";

const EXCLUDED_FIELDS = new Set([
  "id",
  "created_at",
  "updated_at",
  "job_id",
  "title",
]);

const FIELD_ORDER: (keyof JobConfig)[] = [
  "photo_profile",
  "full_name",
  "date_of_birth",
  "gender",
  "domicile",
  "phone_number",
  "email",
  "linkedin_link",
];

interface ApplicationFormProps {
  jobConfig: JobConfig;
  onSubmit?: (data: FieldValues) => void;
  isPending?: boolean;
}

export default function ApplicationForm({
  jobConfig,
  onSubmit,
  isPending,
}: ApplicationFormProps) {
  const formSchema = useMemo(() => generateFormSchema(jobConfig), [jobConfig]);

  const orderedFields = useMemo(() => {
    const keys = Object.keys(jobConfig || {})
      .filter((key) => !EXCLUDED_FIELDS.has(key))
      .filter((key) => Boolean(jobConfig[key as keyof JobConfig]));

    keys.sort((a, b) => {
      const indexA = FIELD_ORDER.indexOf(a as keyof JobConfig);
      const indexB = FIELD_ORDER.indexOf(b as keyof JobConfig);

      if (indexA === -1 && indexB === -1) {
        return a.localeCompare(b);
      }

      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    return keys;
  }, [jobConfig]);

  const defaultValues = useMemo(() => {
    const values: Record<string, string | undefined> = {};

    orderedFields.forEach((key) => {
      const fieldStatus = jobConfig[key as keyof JobConfig];

      if (!fieldStatus) {
        return;
      }

      values[key] = key === "photo_profile" ? undefined : "";
    });

    return values;
  }, [jobConfig, orderedFields]);

  const form = useForm<FieldValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: FieldValues) => {
    const processedData: FieldValues = {
      job_id: jobConfig.job_id,
    };
    const validationErrors: Record<string, string> = {};

    orderedFields.forEach((key) => {
      const fieldStatus = jobConfig[key as keyof JobConfig];
      const value = data[key];

      if (!fieldStatus) return;

      const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (value instanceof Date && isNaN(value.getTime()));

      if (isEmpty) {
        if (fieldStatus === "not_required") {
          processedData[key] = null;
        }
        return;
      }

      switch (key) {
        case "phone_number":
          if (typeof value === "string") {
            const plusIndex = value.indexOf("+");
            if (plusIndex !== -1 && value.length > plusIndex + 1) {
              const phoneWithoutPrefix = value.substring(plusIndex + 1);
              const cleanedPhone = phoneWithoutPrefix
                .trim()
                .replaceAll(" ", "")
                .replaceAll("-", "");
              const parsedPhone = parseInt(cleanedPhone, 10);
              if (!isNaN(parsedPhone) && parsedPhone > 0) {
                processedData[key] = parsedPhone;
              } else {
                if (fieldStatus === "required") {
                  validationErrors[key] = "Invalid phone number";
                }
                processedData[key] = null;
              }
            } else {
              if (fieldStatus === "required") {
                validationErrors[key] = "Invalid phone number";
              }
              processedData[key] = null;
            }
          } else {
            if (fieldStatus === "required") {
              validationErrors[key] = "Invalid phone number";
            }
            processedData[key] = null;
          }
          break;

        case "date_of_birth":
          if (typeof value === "string" || value instanceof Date) {
            const date = typeof value === "string" ? new Date(value) : value;

            if (!isNaN(date.getTime())) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              processedData[key] = `${year}-${month}-${day}`;
            } else {
              if (fieldStatus === "required") {
                const errorMessage = "Invalid date of birth";
                validationErrors[key] = errorMessage;
                form.setError(key, {
                  type: "manual",
                  message: errorMessage,
                });
              }
              processedData[key] = null;
            }
          } else {
            if (fieldStatus === "required") {
              const errorMessage = "Invalid date of birth";
              validationErrors[key] = errorMessage;
              form.setError(key, {
                type: "manual",
                message: errorMessage,
              });
            }
            processedData[key] = null;
          }
          break;

        case "photo_profile":
          if (value instanceof File) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            const ALLOWED_TYPES = [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/webp",
            ];

            if (
              value.size > 0 &&
              value.size <= MAX_FILE_SIZE &&
              ALLOWED_TYPES.includes(value.type)
            ) {
              processedData[key] = value;
            } else {
              processedData[key] = null;
            }
          } else {
            processedData[key] = null;
          }
          break;

        default:
          processedData[key] = value;
          break;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit?.(processedData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col h-full"
      >
        <div className="flex flex-col gap-4 flex-1 pb-16">
          <span className="text-s-bold text-danger">* Required</span>

          {orderedFields.map((key) => {
            const fieldStatus = jobConfig[key as keyof JobConfig];

            if (!fieldStatus) return null;

            return (
              <FormField key={key} control={form.control} name={key as string}>
                {(field, fieldState) => (
                  <JobFormInput
                    field={key as keyof JobConfig}
                    required={fieldStatus === "required"}
                    formField={field}
                    fieldState={fieldState}
                  />
                )}
              </FormField>
            );
          })}
        </div>

        <div className="flex gap-3 p-4 bg-background absolute bottom-0 w-full left-0 rounded-b-xl">
          <Button
            type="submit"
            variant="default"
            size="lg"
            loading={isPending}
            className="w-full"
            disabled={
              form.formState.isSubmitting ||
              isPending ||
              form.formState.isSubmitSuccessful
            }
          >
            {form.formState.isSubmitting || isPending
              ? "Submitting..."
              : "Submit Application"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
