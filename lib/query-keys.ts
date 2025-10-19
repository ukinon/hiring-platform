export const JOBS_QUERY_KEYS = {
  all: ["jobs"] as const,
  detail: (id: string) => [...JOBS_QUERY_KEYS.all, "detail", id] as const,
  lists: () => [...JOBS_QUERY_KEYS.all, "lists"] as const,
  list: (query: string) => [...JOBS_QUERY_KEYS.lists(), query] as const,
};

export const CANDIDATE_QUERY_KEYS = {
  all: ["candidates"] as const,
  detail: (id: string) => [...CANDIDATE_QUERY_KEYS.all, "detail", id] as const,
  lists: (jobId: string) =>
    [...CANDIDATE_QUERY_KEYS.all, "lists", jobId] as const,
  list: (jobId: string, query: string) =>
    [...CANDIDATE_QUERY_KEYS.lists(jobId), query] as const,
};
