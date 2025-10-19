import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import CreateJobForm from "../form/create-job-form";

export default function CreateJobButton({
  variant,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary";
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant || "secondary"} {...props}>
          Create a new job
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Job Opening</DialogTitle>
        </DialogHeader>

        <CreateJobForm />
      </DialogContent>
    </Dialog>
  );
}
