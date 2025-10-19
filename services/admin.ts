import { createClient } from "@/lib/supabase/client";
import { CreateJob } from "@/types";

export async function getCandidates(
  jobId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
  }
) {
  const supabase = await createClient();
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("candidates")
    .select("*", { count: "exact" })
    .eq("job_id", jobId);

  if (params?.search) {
    query = query.or(
      `full_name.ilike.%${params.search}%,email.ilike.%${params.search}%,domicile.ilike.%${params.search}%`
    );
  }

  if (params?.sort) {
    query = query.order(params.sort, {
      ascending: params.order === "asc",
    });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  const { data: jobsData, error: jobsError } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", jobId)
    .single();

  if (error || jobsError) {
    throw new Error(
      `Error fetching candidates: ${error?.message || jobsError?.message}`
    );
  }

  return {
    candidates: data || [],
    jobs: jobsData,
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function createJobPosting(formData: CreateJob) {
  const supabase = await createClient();

  const { job_config, ...jobData } = formData;

  const minSalaryText = jobData.min_salary
    ? `Rp${new Intl.NumberFormat("id-ID").format(jobData.min_salary)}`
    : undefined;
  const maxSalaryText = jobData.max_salary
    ? `Rp${new Intl.NumberFormat("id-ID").format(jobData.max_salary)}`
    : undefined;
  const displayText =
    jobData.min_salary && jobData.max_salary
      ? `${minSalaryText} - ${maxSalaryText}`
      : jobData.min_salary
      ? `minSalaryText`
      : maxSalaryText
      ? maxSalaryText
      : "Negotiable";

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      ...jobData,
      slug: jobData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
      status: "active",
      badge: "Active",
      cta: "Manage jobs",
      currency: "IDR",
      display_text: displayText,
      started_on_text: `Started on ${new Date().toLocaleDateString("id-ID", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Error creating job posting: ${error.message}`);
  }

  const { error: configError } = await supabase
    .from("job_config")
    .insert({ ...job_config, job_id: data.id });

  if (configError) {
    throw new Error(`Error creating job config: ${configError.message}`);
  }
}
