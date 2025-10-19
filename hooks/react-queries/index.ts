import { JOBS_QUERY_KEYS } from "@/lib/query-keys";
import { getJobs, getJob } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export function useJobs() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  // Parse search params
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") || "1", 10)
    : 1;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit") || "10", 10)
    : 10;
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
  const sort = searchParams.get("sort") || undefined;
  const order = (searchParams.get("order") as "asc" | "desc") || undefined;

  return useQuery({
    queryFn: () =>
      getJobs({
        page,
        limit,
        search,
        status,
        sort,
        order,
      }),
    queryKey: JOBS_QUERY_KEYS.list(queryString),
  });
}

export function useJobDetail(jobId: string) {
  return useQuery({
    queryFn: () => getJob(jobId),
    queryKey: JOBS_QUERY_KEYS.detail(jobId),
    enabled: !!jobId,
  });
}
