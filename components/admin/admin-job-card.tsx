import { Job } from "@/types";
import React from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

export default function AdminJobCard({ job }: { job: Job }) {
  return (
    <Card
      key={job.id}
      className={cn(
        "p-3 md:p-4 border border-neutral-40 rounded-lg gap-1 mb-3 relative shadow-md"
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={"success"} className="rounded-sm text-xs">
            {job.badge}
          </Badge>

          <Badge variant={"outline"} className="rounded-sm text-xs">
            {job.started_on_text}
          </Badge>
        </div>
        <h2 className="text-base md:text-l-bold text-neutral-100 pr-20 md:pr-0">
          {job.title}
        </h2>

        <div className="flex justify-between items-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            {job.display_text}
          </p>
        </div>
        <Link href={`/admin/candidates/${job.id}`}>
          <Button className="py-1.5 rounded-lg px-4 md:px-6 h-fit absolute right-3 bottom-3 cursor-pointer text-xs md:text-sm">
            {job.cta}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
