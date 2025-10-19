"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "../ui/form";
import FormField from "../form-field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useLoginMutation } from "@/hooks/react-queries/auth";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircleIcon } from "lucide-react";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const { mutate, isPending, error } = useLoginMutation();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof loginSchema>) => {
    mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 ">
        {error && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Login failed.</AlertTitle>
            <AlertDescription>
              <p>Please verify your login credentials and try again.</p>
            </AlertDescription>
          </Alert>
        )}
        <FormField control={form.control} label="Email" name="email">
          {(field, fieldState) => (
            <Input
              type="email"
              placeholder="Email"
              aria-invalid={Boolean(fieldState.error)}
              {...field}
            />
          )}
        </FormField>

        <FormField control={form.control} label="Password" name="password">
          {(field, fieldState) => (
            <Input
              type="password"
              placeholder="Password"
              aria-invalid={Boolean(fieldState.error)}
              {...field}
            />
          )}
        </FormField>

        <Button loading={isPending} type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
}
