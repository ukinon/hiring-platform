import React from "react";
import { Spinner } from "@/components/ui/spinner";

export default function loading() {
  return (
    <div className="flex items-center justify-center h-[92vh] w-full overflow-hidden">
      <Spinner className="size-12 text-primary" />
    </div>
  );
}
