import { createClient } from "@/lib/supabase/client";

export async function getJobs() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("jobs").select("*");
  if (error) {
    throw error;
  }
  return data;
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
