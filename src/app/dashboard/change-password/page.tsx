import type { Metadata } from "next";
import { Suspense } from "react";
import { createPageMetadata } from "@/config/site-metadata";
import DashboardChangePasswordContent from "@/features/dashboard/components/dashboard-change-password-content";

export const metadata: Metadata = createPageMetadata("changePassword");

export default function DashboardChangePasswordPage() {
  return (
    <Suspense fallback={null}>
      <DashboardChangePasswordContent />
    </Suspense>
  );
}
