import React from "react";
import { Spinner } from "@/components/ui/spinner";

export default function loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[92vh] w-full overflow-hidden gap-4">
      <Spinner className="size-10 text-primary" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}
