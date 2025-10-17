import { Job } from "@/types";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

export default function JobDetail({ selectedJob }: { selectedJob: Job }) {
  return (
    <Card className="h-full w-full rounded-sm p-[28px]">
      <CardHeader className="border-b">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <Image
              src="/assets/job-icon.png"
              className="size-12"
              width={48}
              height={48}
              alt="Job Icon"
            />
            <div className="flex flex-col">
              <Badge variant={"default"} className="rounded-[4px]">
                Full-time
              </Badge>
              <h1 className="text-l-bold">{selectedJob.title}</h1>
              <p className="text-m-regular">Rakamin</p>
            </div>
          </div>

          <Link href={`/apply/${selectedJob.id}`}>
            <Button variant="secondary">Apply</Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="list-disc">
          <li className="text-m-regular">
            Develop, test, and maintain responsive, high-performance web
            applications using modern front-end technologies.
          </li>
          <li className="text-m-regular">
            Collaborate with UI/UX designers to translate wireframes and
            prototypes into functional code.
          </li>
          <li className="text-m-regular">
            Integrate front-end components with APIs and backend services.
          </li>
          <li className="text-m-regular">
            Ensure cross-browser compatibility and optimize applications for
            maximum speed and scalability.
          </li>
          <li className="text-m-regular">
            Write clean, reusable, and maintainable code following best
            practices and coding standards.
          </li>
          <li className="text-m-regular">
            Participate in code reviews, contributing to continuous improvement
            and knowledge sharing.
          </li>
          <li className="text-m-regular">
            Troubleshoot and debug issues to improve usability and overall
            application quality.
          </li>
          <li className="text-m-regular">
            Stay updated with emerging front-end technologies and propose
            innovative solutions.
          </li>
          <li className="text-m-regular">
            Collaborate with UI/UX designers to translate wireframes and
            prototypes into functional code.
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
