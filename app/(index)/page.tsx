import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import IndexClientPage from "./client-page";
import { JOBS_QUERY_KEYS } from "@/lib/query-keys";
import { SearchParams } from "@/types";
import { getJobs } from "@/services";

export default async function IndexPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { ...params } = await searchParams;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: JOBS_QUERY_KEYS.list(params),
    queryFn: () => getJobs(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <IndexClientPage />
    </HydrationBoundary>
  );
}
