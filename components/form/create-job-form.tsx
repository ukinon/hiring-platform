"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import FormField from "../form-field";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { jobDetailSchema } from "@/types/schema.types";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

type FieldStatus = "required" | "not_required" | null;

const PROFILE_FIELDS = [
  { key: "full_name", label: "Full name" },
  { key: "photo_profile", label: "Photo Profile" },
  { key: "gender", label: "Gender" },
  { key: "domicile", label: "Domicile" },
  { key: "email", label: "Email" },
  { key: "phone_number", label: "Phone number" },
  { key: "linkedin_link", label: "LinkedIn link" },
  { key: "date_of_birth", label: "Date of birth" },
] as const;

export default function CreateJobForm({
  form,
}: {
  form: UseFormReturn<z.infer<typeof jobDetailSchema>>;
}) {
  return (
    <Form {...form}>
      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-2 ">
          <FormField
            label="Job Name"
            name="title"
            required
            control={form.control}
          >
            {(field) => <Input placeholder="Job Name" id="title" {...field} />}
          </FormField>

          <FormField
            label="Department"
            name="department"
            required
            control={form.control}
          >
            {(field) => (
              <Input
                placeholder="e.g. Engineering, Marketing"
                id="department"
                {...field}
              />
            )}
          </FormField>

          <FormField
            label="Company"
            name="company"
            required
            control={form.control}
          >
            {(field) => (
              <Input placeholder="Company Name" id="company" {...field} />
            )}
          </FormField>

          <FormField
            label="Job Type"
            name="type"
            required
            control={form.control}
          >
            {(field) => (
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField
            label="Job description"
            required
            name="description"
            control={form.control}
          >
            {(field) => (
              <Textarea
                placeholder="Job description"
                id="description"
                minHeight={72}
                className="resize-none"
                {...field}
              />
            )}
          </FormField>

          <FormField
            label="Needed Candidates"
            name="needed_candidates"
            required
            control={form.control}
          >
            {(field) => (
              <Input
                type="number"
                placeholder="Needed Candidates"
                id="needed_candidates"
                {...field}
              />
            )}
          </FormField>

          <label className="text-s-regular  mb-1">Job Salary</label>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              label="Minimum estimated salary"
              name="min_salary"
              control={form.control}
            >
              {(field) => (
                <InputGroup>
                  <InputGroupAddon>Rp</InputGroupAddon>
                  <InputGroupInput
                    type="number"
                    placeholder="7.000.000"
                    id="min_salary"
                    {...field}
                    value={field.value ?? ""}
                  />
                </InputGroup>
              )}
            </FormField>

            <FormField
              label="Maximum estimated salary"
              name="max_salary"
              control={form.control}
            >
              {(field) => (
                <InputGroup>
                  <InputGroupAddon>Rp</InputGroupAddon>
                  <InputGroupInput
                    type="number"
                    placeholder="8.000.000"
                    id="max_salary"
                    {...field}
                    value={field.value ?? ""}
                  />
                </InputGroup>
              )}
            </FormField>
          </div>

          <div className="border rounded-lg p-4 flex flex-col gap-4">
            <h1 className="text-m-bold">
              Minimum Profile Information Required
            </h1>

            <div className="flex flex-col gap-3">
              {PROFILE_FIELDS.map((field) => {
                const isFullName = field.key === "full_name";

                return (
                  <div
                    key={field.key}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <span className="text-sm">{field.label}</span>
                    <FormField
                      name={
                        `job_config.${field.key}` as keyof z.infer<
                          typeof jobDetailSchema
                        >
                      }
                      control={form.control}
                    >
                      {(fieldProps) => {
                        const currentValue = fieldProps.value as FieldStatus;

                        return (
                          <ToggleGroup
                            type="single"
                            value={
                              isFullName || currentValue === "required"
                                ? "mandatory"
                                : currentValue === "not_required"
                                ? "optional"
                                : "off"
                            }
                            onValueChange={(value) => {
                              if (isFullName) return;

                              if (value === "mandatory") {
                                fieldProps.onChange("required");
                              } else if (value === "optional") {
                                fieldProps.onChange("not_required");
                              } else if (value === "off") {
                                fieldProps.onChange(null);
                              }
                            }}
                            className="gap-1"
                          >
                            <ToggleGroupItem
                              value="mandatory"
                              className="data-[state=on]:border-primary data-[state=on]:text-primary px-4 py-1.5 text-xs border disabled:opacity-50 disabled:cursor-not-allowed rounded-full first:rounded-full"
                              size="sm"
                            >
                              Mandatory
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="optional"
                              className="data-[state=on]:border-primary data-[state=on]:text-primary px-4 py-1.5 text-xs border disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
                              size="sm"
                              disabled={isFullName}
                            >
                              Optional
                            </ToggleGroupItem>
                            <ToggleGroupItem
                              value="off"
                              className="data-[state=on]:border-primary data-[state=on]:text-primary px-4 py-1.5 text-xs border disabled:opacity-50 disabled:cursor-not-allowed rounded-full last:rounded-full"
                              size="sm"
                              disabled={isFullName}
                            >
                              Off
                            </ToggleGroupItem>
                          </ToggleGroup>
                        );
                      }}
                    </FormField>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
}
