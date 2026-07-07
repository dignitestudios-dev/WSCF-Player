import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import MyHistory from "@/features/dashboard/components/my-history";

export const metadata: Metadata = createPageMetadata("myHistory");

export default function MyHistoryPage() {
  return <MyHistory />;
}
