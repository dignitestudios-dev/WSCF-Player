import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import MyProfile from "@/features/dashboard/components/my-profile";

export const metadata: Metadata = createPageMetadata("myProfile");

export default function MyProfilePage() {
  return <MyProfile />;
}
