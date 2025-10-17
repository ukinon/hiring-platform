import { z } from "zod";
import { JobConfig } from "@/types";

const fieldTypeMap: Record<string, z.ZodTypeAny> = {
  full_name: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  date_of_birth: z.date("Date of birth is required"),
  gender: z.enum(["male", "female"], {
    message: "Please select a gender",
  }),
  domicile: z.string().min(1, "Domicile is required"),
  linkedin_link: z.url("Invalid LinkedIn URL"),
  photo_profile: z
    .instanceof(File, { message: "Please upload a file" })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "Only JPEG and PNG images are allowed",
      }
    ),
};

function makeOptional(schema: z.ZodTypeAny): z.ZodTypeAny {
  return schema.optional().or(z.literal(""));
}

export function generateFormSchema(
  jobConfig: JobConfig | null
): z.ZodObject<z.ZodRawShape> {
  if (!jobConfig) {
    return z.object({}) as z.ZodObject<Record<string, z.ZodTypeAny>>;
  }

  const schemaShape: Record<string, z.ZodTypeAny> = {};

  Object.keys(jobConfig).forEach((key) => {
    if (
      key === "id" ||
      key === "created_at" ||
      key === "updated_at" ||
      key === "job_id" ||
      key === "title"
    ) {
      return;
    }

    const fieldKey = key as keyof JobConfig;
    const fieldStatus = jobConfig[fieldKey];

    if (fieldStatus) {
      const baseSchema = fieldTypeMap[key] || z.string();

      if (fieldStatus === "required") {
        schemaShape[key] = baseSchema;
      } else if (fieldStatus === "not_required") {
        schemaShape[key] = makeOptional(baseSchema);
      }
    }
  });

  return z.object(schemaShape) as z.ZodObject<Record<string, z.ZodTypeAny>>;
}

export type InferredFormData = z.infer<ReturnType<typeof generateFormSchema>>;
