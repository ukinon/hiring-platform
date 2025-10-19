import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import AdminClientPage from "./client-page";
import { JOBS_QUERY_KEYS } from "@/lib/query-keys";
import { SearchParams } from "@/types";
import { getJobs } from "@/services";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const queryString = Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: JOBS_QUERY_KEYS.list(queryString),
    queryFn: () => getJobs(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminClientPage />
    </HydrationBoundary>
  );
}
