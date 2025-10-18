import { Tables } from "./database.types";

export interface SearchParams {
  page?: string;
  search?: string;
  sort?: string;
  order?: string;
  limit?: string;
  filter?: string;
  range?: string;
}

export type Job = Tables<"jobs">;
export type JobConfig = Tables<"job_config">;
export type Candidate = Tables<"candidates">;
