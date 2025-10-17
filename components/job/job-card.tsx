import { Job } from "@/types";
import React from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Banknote, MapPinIcon } from "lucide-react";

export default function JobCard({
  job,
  selected,
  onSelect,
}: {
  job: Job;
  selected?: boolean;
  onSelect?: (job: Job) => void;
}) {
  return (
    <Card
      onClick={() => onSelect?.(job)}
      key={job.id}
      className={cn(
        "p-4 border border-neutral-40 rounded-lg cursor-pointer transition-all hover:border-primary hover:shadow-md gap-1 mb-3",
        selected
          ? "border-primary bg-primary-surface border-2"
          : "bg-neutral-10"
      )}
    >
      <div className="flex items-center gap-3 border-b border-dashed border-neutral-40 pb-1">
        <Image
          src="/assets/job-icon.png"
          className="size-12"
          width={48}
          height={48}
          alt="Job Icon"
        />
        <div className="flex flex-col gap-0">
          <h2 className="text-l-bold text-neutral-100">{job.title}</h2>
          <p className="text-m-regular text-neutral-70">Rakamin</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <MapPinIcon className="size-4 text-neutral-70" />
          <p className="text-sm text-muted-foreground">Jakarta Selatan</p>
        </div>
        <div className="flex gap-2 items-center">
          <Banknote className="size-4 text-neutral-70" />
          <p className="text-sm text-muted-foreground">{job.display_text}</p>
        </div>
      </div>
    </Card>
  );
}
