import z from "zod";

export const jobDetailSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  type: z.enum(
    ["Full-Time", "Part-Time", "Internship", "Contract", "Freelance"],
    {
      error: "Please select a job type.",
    }
  ),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  needed_candidates: z.coerce.number().min(1, {
    message: "There must be at least 1 needed candidate.",
  }),
  min_salary: z.coerce.number().nullable(),
  max_salary: z.coerce.number().nullable(),
  job_config: z.object({
    title: z.string().nullable(),
    full_name: z.enum(["required", "not_required"]).nullable(),
    email: z.enum(["required", "not_required"]).nullable(),
    photo_profile: z.enum(["required", "not_required"]).nullable(),
    date_of_birth: z.enum(["required", "not_required"]).nullable(),
    gender: z.enum(["required", "not_required"]).nullable(),
    domicile: z.enum(["required", "not_required"]).nullable(),
    phone_number: z.enum(["required", "not_required"]).nullable(),
    linkedin_link: z.enum(["required", "not_required"]).nullable(),
  }),
});
