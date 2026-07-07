import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createPageMetadata } from "@/config/site-metadata";

export const metadata: Metadata = createPageMetadata("login");

export default function HomePage() {
  redirect("/auth/login");
}
