import { Database, Tables } from "./database.types";

export interface SearchParams {
  page?: number;
  search?: string;
  sort?: string;
  order?: string;
  limit?: number;
  filter?: string;
  range?: string;
  status?: string;
}

export type Job = Tables<"jobs">;
export type JobConfig = Tables<"job_config">;
export type Candidate = Tables<"candidates">;

export type CreateJob = {
  title: string;
  department: string;
  company: string;
  type: "Full-Time" | "Part-Time" | "Internship" | "Contract" | "Freelance";
  description: string;
  needed_candidates: number;
  min_salary: number | null;
  max_salary: number | null;
  job_config: {
    title: string | null;
    full_name: Database["public"]["Enums"]["field_status"] | null;
    email: Database["public"]["Enums"]["field_status"] | null;
    phone_number: Database["public"]["Enums"]["field_status"] | null;
    domicile: Database["public"]["Enums"]["field_status"] | null;
    date_of_birth: Database["public"]["Enums"]["field_status"] | null;
    linkedin_link: Database["public"]["Enums"]["field_status"] | null;
    photo_profile: Database["public"]["Enums"]["field_status"] | null;
    gender: Database["public"]["Enums"]["field_status"] | null;
  };
};
