import { createClient } from "@/lib/supabase/client";
import { SearchParams } from "@/types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw error;
  }
  return data.user;
}

export async function getJobs(params?: SearchParams) {
  console.log(
    "=== getJobs called with params:",
    JSON.stringify(params, null, 2)
  );

  const supabase = await createClient();
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("jobs").select("*", { count: "exact" });

  // Apply status filter first
  if (params?.status) {
    console.log("Applying status filter:", params.status);
    query = query.eq("status", params.status);
  }

  // Apply search filter using case-insensitive partial match
  if (params?.search && params.search.trim() !== "") {
    const searchTerm = params.search.trim();
    console.log("Applying search filter with term:", searchTerm);
    query = query.ilike("title", `%${searchTerm}%`);
  } else {
    console.log("NO search filter applied. params.search:", params?.search);
  }

  // Apply sorting
  if (params?.sort) {
    query = query.order(params.sort, {
      ascending: params.order === "asc",
    });
  } else {
    // Default sorting by created_at
    query = query.order("created_at", { ascending: false });
  }

  // Apply pagination
  query = query.range(from, to);

  const { data, error, count } = await query;

  console.log("=== Query result:", {
    dataLength: data?.length,
    total: count,
    hasError: !!error,
    firstJobTitle: data?.[0]?.title,
  });

  if (error) {
    console.error("Supabase query error:", error);
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
