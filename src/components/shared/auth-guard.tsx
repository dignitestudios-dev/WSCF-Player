"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthUserQuery } from "@/features/auth/api/auth.queries";
import { MEMBERSHIP_VALIDATION_ROUTE } from "@/config/routes";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isSuccess } = useAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isSuccess && data) {
      const membership = data.data?.membership;
      if (!membership && pathname !== MEMBERSHIP_VALIDATION_ROUTE) {
        window.location.replace(MEMBERSHIP_VALIDATION_ROUTE);
      }
    }
  }, [isSuccess, data, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F7F6FF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#083F92] border-t-transparent" />
      </div>
    );
  }

  // If no membership, prevent dashboard from rendering at all while redirecting
  if (isSuccess && data && !data.data?.membership && pathname !== MEMBERSHIP_VALIDATION_ROUTE) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-[#F7F6FF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#083F92] border-t-transparent" />
        <p className="text-lg font-medium text-[#083F92]">Redirecting to membership setup...</p>
      </div>
    );
  }

  return <>{children}</>;
}
