"use client";
import { Button } from "@/components/ui/button";
import { useJobs } from "@/hooks/react-queries";
import React from "react";

export default function IndexClientPage() {
  const { data: jobs } = useJobs();
  return (
    <div>
      {jobs?.map((job) => (
        <div key={job.id} className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-bold">{job.title}</h2>
          <Button>{job.cta}</Button>
        </div>
      ))}
    </div>
  );
}
