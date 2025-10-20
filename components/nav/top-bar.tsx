"use client";

import { ChevronRight } from "lucide-react";
import AuthButton from "../auth/auth-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export default function TopBar() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length === 0) {
      return [{ label: "Job list", href: "/" }];
    }

    if (segments[0] === "admin" && segments.length > 1) {
      return [
        { label: "Job list", href: "/admin" },
        {
          label: "Manage Candidates",
          href: `/admin/${segments[1]}/candidates`,
        },
      ];
    }

    if (segments[0] === "apply" && segments.length > 1) {
      return [
        { label: "Job list", href: "/" },
        { label: "Apply", href: `/apply/${segments[1]}` },
      ];
    }

    return [{ label: "Job list", href: "/" }];
  }, [pathname]);

  return (
    <div className="fixed top-0 h-[8vh] border-b max-w-7xl bg-background z-50 w-full flex justify-between px-2 sm:px-6 items-center">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.href} className="flex items-center gap-1 sm:gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />}
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage className="text-xs sm:text-m-bold font-medium bg-neutral-30 border border-neutral-50 py-1 sm:py-1.5 px-2 sm:px-4 rounded-lg text-black">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    className="border py-1 sm:py-1.5 px-2 sm:px-4 rounded-lg text-xs sm:text-m-bold text-black"
                    asChild
                  >
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <AuthButton />
    </div>
  );
}
