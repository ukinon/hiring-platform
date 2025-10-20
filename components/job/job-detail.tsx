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
                Full-time
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

      <CardContent className="px-0">
        <ul className="list-disc pl-4 md:pl-5 space-y-1">
          <li className="text-xs md:text-m-regular">
            Develop, test, and maintain responsive, high-performance web
            applications using modern front-end technologies.
          </li>
          <li className="text-xs md:text-m-regular">
            Collaborate with UI/UX designers to translate wireframes and
            prototypes into functional code.
          </li>
          <li className="text-xs md:text-m-regular">
            Integrate front-end components with APIs and backend services.
          </li>
          <li className="text-xs md:text-m-regular">
            Ensure cross-browser compatibility and optimize applications for
            maximum speed and scalability.
          </li>
          <li className="text-xs md:text-m-regular">
            Write clean, reusable, and maintainable code following best
            practices and coding standards.
          </li>
          <li className="text-xs md:text-m-regular">
            Participate in code reviews, contributing to continuous improvement
            and knowledge sharing.
          </li>
          <li className="text-xs md:text-m-regular">
            Troubleshoot and debug issues to improve usability and overall
            application quality.
          </li>
          <li className="text-xs md:text-m-regular">
            Stay updated with emerging front-end technologies and propose
            innovative solutions.
          </li>
          <li className="text-xs md:text-m-regular">
            Collaborate with UI/UX designers to translate wireframes and
            prototypes into functional code.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
