"use client";

import JobDetail from "@/components/job/job-detail";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobDetail } from "@/hooks/react-queries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function JobDetailClientPage({ id }: { id: string }) {
  const { data: job, isLoading } = useJobDetail(id);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full overflow-hidden py-[2vh] px-2 md:px-4">
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <div className="flex gap-4 items-center">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-6 w-64" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <h2 className="text-xl-bold mb-2">Job not found</h2>
          <p className="text-muted-foreground mb-4">
            The job you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push("/")}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-2 md:px-6 py-4 space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="w-fit gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <div className="max-w-4xl mx-auto w-full">
        <JobDetail selectedJob={job} />
      </div>
    </div>
  );
}
