import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginHub from "@/features/auth/components/login-hub";

export const metadata: Metadata = createPageMetadata("login");

export default function LoginPage() {
  return <LoginHub />;
}
