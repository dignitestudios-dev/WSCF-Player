import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import DashboardOverview from "@/features/dashboard/components/dashboard-overview";

export const metadata: Metadata = createPageMetadata("dashboard");

export default function DashboardPage() {
  return <DashboardOverview />;
}
