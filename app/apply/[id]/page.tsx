import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { JOBS_QUERY_KEYS } from "@/lib/query-keys";
import { getJob } from "@/services";
import ApplyClientPage from "./client-page";

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: JOBS_QUERY_KEYS.detail(id),
    queryFn: () => getJob(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ApplyClientPage id={id} />
    </HydrationBoundary>
  );
}
