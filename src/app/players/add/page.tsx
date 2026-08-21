import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import AddPlayerContent from "@/features/players/components/add-player-content";

export const metadata: Metadata = createPageMetadata("addPlayer");

export default function AddPlayerPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[515px]" hideLogo>
      <AddPlayerContent />
    </LoginShell>
  );
}
