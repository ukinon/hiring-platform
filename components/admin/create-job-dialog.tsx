"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import CreateJobForm from "../form/create-job-form";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { jobDetailSchema } from "@/types/schema.types";
import { AlertCircleIcon, X } from "lucide-react";
import { useCreateJobMutation } from "@/hooks/react-queries/admin";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

export default function CreateJobBDialog({
  variant,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary";
}) {
  const [open, setOpen] = React.useState(false);
  const { mutateAsync, isPending, error } = useCreateJobMutation();

  const form = useForm<z.infer<typeof jobDetailSchema>>({
    resolver: zodResolver(jobDetailSchema) as Resolver<
      z.infer<typeof jobDetailSchema>
    >,
    defaultValues: {
      title: "",
      description: "",
      needed_candidates: 1,
      min_salary: null,
      max_salary: null,
      job_config: {
        full_name: "required",
        title: null,
        email: null,
        phone_number: null,
        domicile: null,
        date_of_birth: null,
        linkedin_link: null,
        photo_profile: null,
        gender: null,
      },
    },
  });
  const onSubmit = async (values: z.infer<typeof jobDetailSchema>) => {
    await mutateAsync(values);
    form.reset();
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant || "secondary"} {...props}>
          Create a new job
        </Button>
      </DialogTrigger>
      <DialogContent className="h-screen sm:h-[90vh] w-screen  sm:w-[70vw] flex flex-col p-0 gap-0 rounded-lg">
        <div className="flex items-center justify-between sticky top-0 z-10 bg-background border-b px-6 pt-6 pb-4 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="text-xl-bold">Job Opening</DialogTitle>
          </DialogHeader>
          <DialogClose>
            <X />
          </DialogClose>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Failed to publish job.</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <CreateJobForm form={form} />
        </div>

        <div className="sticky  z-10 bg-background px-6 py-4 rounded-b-lg">
          <DialogFooter>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              variant="default"
              size="sm"
              loading={isPending}
              className="w-fit px-5 h-8"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Publishing..." : "Publish Job"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
