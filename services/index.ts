import { createClient } from "@/lib/supabase/client";

export async function getJobs() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("jobs").select("*");
  if (error) {
    throw error;
  }
  return data;
}
