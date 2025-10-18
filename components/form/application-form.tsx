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
    console.log("Form submitted:", data);
    onSubmit?.({
      ...data,
      phone_number: parseInt(
        data.phone_number?.split("+")[1].trim().replaceAll(" ", "")
      ),
      job_id: jobConfig.job_id,
    });
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
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Submitting..."
              : "Submit Application"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
