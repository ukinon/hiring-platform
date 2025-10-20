import { Job } from "@/types";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

export default function JobDetail({ selectedJob }: { selectedJob: Job }) {
  return (
    <Card className="h-full w-full rounded-sm p-4 md:p-[28px]">
      <CardHeader className="border-b px-0">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-start gap-2 md:gap-4">
            <Image
              src="/assets/job-icon.png"
              className="size-10 md:size-12"
              width={48}
              height={48}
              alt="Job Icon"
            />
            <div className="flex flex-col">
              <Badge variant={"default"} className="rounded-[4px] w-fit">
                {selectedJob.type}
              </Badge>
              <h1 className="text-base md:text-l-bold">{selectedJob.title}</h1>
              <p className="text-sm md:text-m-regular">Rakamin</p>
            </div>
          </div>

          <Link href={`/apply/${selectedJob.id}`}>
            <Button variant="secondary" size="sm" className="md:size-default">
              Apply
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="px-0">{selectedJob.description}</CardContent>
    </Card>
  );
}
