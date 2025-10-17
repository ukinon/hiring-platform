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

interface ApplicationFormProps {
  jobConfig: JobConfig;
  onSubmit?: (data: FieldValues) => void;
  renderFooter?: (props: { isSubmitting: boolean }) => React.ReactNode;
}

export default function ApplicationForm({
  jobConfig,
  onSubmit,
  renderFooter,
}: ApplicationFormProps) {
  const formSchema = useMemo(() => generateFormSchema(jobConfig), [jobConfig]);

  const defaultValues = useMemo(() => {
    const values: Record<string, string | undefined> = {};

    Object.keys(jobConfig || {})
      .filter(
        (key) =>
          key !== "id" &&
          key !== "created_at" &&
          key !== "updated_at" &&
          key !== "job_id" &&
          key !== "title"
      )
      .forEach((key) => {
        const fieldStatus = jobConfig[key as keyof JobConfig];
        if (fieldStatus) {
          // File inputs should be undefined, other fields empty string
          values[key] = key === "photo_profile" ? undefined : "";
        }
      });

    return values;
  }, [jobConfig]);

  const form = useForm<FieldValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: FieldValues) => {
    console.log("Form submitted:", data);
    onSubmit?.(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col h-full "
      >
        <div className="flex flex-col gap-4 flex-1">
          <span className="text-s-bold text-danger">* Required</span>

          {Object.keys(jobConfig || {})
            .filter(
              (key) =>
                key !== "id" &&
                key !== "created_at" &&
                key !== "updated_at" &&
                key !== "job_id" &&
                key !== "title"
            )
            .map((key) => {
              const fieldStatus = jobConfig[key as keyof JobConfig];

              if (!fieldStatus) return null;

              return (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as string}
                >
                  {(field) => (
                    <JobFormInput
                      field={key as keyof JobConfig}
                      required={fieldStatus === "required"}
                      formField={field}
                    />
                  )}
                </FormField>
              );
            })}
        </div>

        {renderFooter ? (
          renderFooter({ isSubmitting: form.formState.isSubmitting })
        ) : (
          <div className="flex gap-3 p-4 bg-background absolute bottom-0 w-full left-0">
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? "Submitting..."
                : "Submit Application"}
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
