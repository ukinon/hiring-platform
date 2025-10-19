"use client";

import React from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import CreateJobBDialog from "./create-job-dialog";

export default function CreateJobCTA() {
  return (
    <Card className="w-full relative overflow-hidden border-primary/20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/cta-background.jpg"
          alt="CTA Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <CardContent className="relative z-10 px-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl-bold text-white">
            Recruit the best candidates
          </h3>
          <p className="text-sm-regular text-white/80">
            Create jobs, invite, and hire with ease
          </p>
        </div>

        <CreateJobBDialog variant="default" className="w-full" />
      </CardContent>
    </Card>
  );
}
