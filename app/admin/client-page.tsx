"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/react-queries";
import React from "react";
import AdminEmptyPage from "./empty-page";
import AdminJobCard from "@/components/admin/admin-job-card";
import Paginator from "@/components/paginator";

export default function AdminClientPage() {
  const { data: jobsData, isLoading } = useJobs();

  const jobs = jobsData?.data || [];
  const totalPages = jobsData?.totalPages || 1;
  const total = jobsData?.total || 0;
  const currentPage = jobsData?.page || 1;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-6 gap-1">
        <div className="space-y-3 md:col-span-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg space-y-3 bg-card">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:flex md:col-span-2 items-start justify-start p-4">
          <Skeleton className="h-32 w-32" />
        </div>
      </div>
    );
  }
  return (
    <div>
      {(!jobs || jobs.length === 0) && <AdminEmptyPage />}
      <ScrollArea className="flex-1  h-[80vh]">
        {jobs?.map((job) => (
          <AdminJobCard key={job.id} job={job} />
        ))}
      </ScrollArea>
      {totalPages > 1 && (
        <div className="mt-4">
          <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            data={jobs}
          />
        </div>
      )}
    </div>
  );
}
