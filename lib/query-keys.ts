export const JOBS_QUERY_KEYS = {
  all: ["jobs"] as const,
  detail: (id: string) => [...JOBS_QUERY_KEYS.all, "detail", id] as const,
  lists: () => [...JOBS_QUERY_KEYS.all, "lists"] as const,
  list: (query: string) => [...JOBS_QUERY_KEYS.lists(), query] as const,
};
