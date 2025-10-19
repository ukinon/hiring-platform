"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobs } from "@/hooks/react-queries";
import React from "react";
import AdminEmptyPage from "./empty-page";
import CreateJobCTA from "@/components/admin/create-job-cta";
import SearchInput from "@/components/search-input";
import FilterInput from "@/components/filter-input";
import AdminJobCard from "@/components/admin/admin-job-card";

export default function AdminClientPage() {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading) {
    return (
      <div className="grid grid-cols-6 gap-1">
        <div className="space-y-3 col-span-5">
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

        <div className="col-span-2  flex items-start justify-start p-4">
          <Skeleton className="h-32 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-6 gap-1">
      <div className="col-span-4 p-3">
        <div className="flex gap-2">
          <SearchInput placeholder="Search by job details" />
          <FilterInput
            options={[
              {
                label: "Active",
                value: "active",
              },
            ]}
            className="w-fit"
            paramName="status"
          />
        </div>
        {(!jobs || jobs.length === 0) && !isLoading && <AdminEmptyPage />}
        <ScrollArea className="h-[80vh] py-3">
          {jobs?.map((job) => (
            <AdminJobCard key={job.id} job={job} />
          ))}
        </ScrollArea>
      </div>

      <div className="col-span-2 h-[92vh] flex items-start justify-start p-2">
        <CreateJobCTA />
      </div>
    </div>
  );
}
