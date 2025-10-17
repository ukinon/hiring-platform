import { JOBS_QUERY_KEYS } from "@/lib/query-keys";
import { getJobs, getJob } from "@/services";
import { useQuery } from "@tanstack/react-query";

export function useJobs() {
  return useQuery({
    queryFn: getJobs,
    queryKey: [JOBS_QUERY_KEYS.lists()],
  });
}

export function useJobDetail(jobId: string) {
  return useQuery({
    queryFn: () => getJob(jobId),
    queryKey: [JOBS_QUERY_KEYS.detail(jobId)],
    enabled: !!jobId,
  });
}
