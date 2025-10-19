import { createClient } from "@/lib/supabase/client";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
}

export async function getJobs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
  order?: "asc" | "desc";
}) {
  const supabase = await createClient();
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("jobs").select("*", { count: "exact" });

  if (params?.search) {
    query = query.or(
      `title.ilike.%${params.search}%,description.ilike.%${params.search}%,type.ilike.%${params.search}%`
    );
  }

  if (params?.status) {
    query = query.eq("status", params.status);
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

  if (error) {
    throw error;
  }

  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function getJob(jobId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select("*, job_config(*)")
    .eq("id", jobId)
    .single();
  if (error) {
    throw error;
  }
  return data;
}
