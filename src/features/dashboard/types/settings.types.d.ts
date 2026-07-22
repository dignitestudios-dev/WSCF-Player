interface SettingsItem {
  id: string;
  label: string;
  href?: string;
  action?: "logout" | "terms" | "privacy" | "change-password" | "notification" | "renew-membership";
  danger?: boolean;
}

type PolicyModalType = "terms" | "privacy";

interface PolicySection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}
