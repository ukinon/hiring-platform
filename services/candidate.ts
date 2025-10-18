import { createClient } from "@/lib/supabase/client";
import { Candidate } from "@/types";

export async function applyToJob(candidateData: Partial<Candidate>) {
  const supabase = await createClient();

  const { data, error } = await supabase.from("candidates").insert([
    {
      full_name: candidateData.full_name,
      email: candidateData.email,
      domicile: candidateData.domicile,
      gender: candidateData.gender,
      phone_number: candidateData.phone_number,
      date_of_birth: candidateData.date_of_birth,
      job_id: candidateData.job_id,
      linkedin_link: candidateData.linkedin_link,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
