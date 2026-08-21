import type { Metadata } from "next";
import { createPageMetadata } from "@/config/site-metadata";
import LoginShell from "@/features/auth/components/login-shell";
import SelectPlayerContent from "@/features/players/components/select-player-content";

export const metadata: Metadata = createPageMetadata("selectPlayer");

export default function SelectPlayerPage() {
  return (
    <LoginShell contentMaxWidth="max-w-[515px]" hideLogo>
      <SelectPlayerContent />
    </LoginShell>
  );
}
