import JobDetailClientPage from "./client-page";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  return <JobDetailClientPage id={params.id} />;
}
