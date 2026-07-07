interface SettingsItem {
  id: string;
  label: string;
  href?: string;
  action?: "logout" | "terms" | "privacy" | "change-password" | "notification" | "delete-account";
  danger?: boolean;
}

type PolicyModalType = "terms" | "privacy";

interface PolicySection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}
