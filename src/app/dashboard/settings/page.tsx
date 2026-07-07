import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import Settings from "@/features/dashboard/components/settings";

export const metadata: Metadata = createPageMetadata("settings");

export default function SettingsPage() {
  return <Settings />;
}
