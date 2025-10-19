import { createClient } from "@/lib/supabase/client";

export async function getCandidates(jobId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("job_id", jobId);

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

  return { candidates: data, jobs: jobsData };
}
