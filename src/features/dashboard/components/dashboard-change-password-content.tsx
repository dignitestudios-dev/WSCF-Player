import Link from "next/link";
import SetNewPasswordForm from "@/features/auth/components/set-new-password-form";
import { SETTINGS_ROUTE } from "@/config/routes";

function BackIcon() {
  return (
    <svg width="15" height="27" viewBox="0 0 15 27" fill="none" aria-hidden="true">
      <path
        d="M13 2L2 13.5L13 25"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DashboardChangePasswordContent() {
  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
      <Link
        href={SETTINGS_ROUTE}
        className="mb-6 inline-flex items-center gap-3 text-lg font-medium leading-6 text-[#083F92]"
      >
        <BackIcon />
        Back
      </Link>

      <h1 className="mb-8 text-[45px] font-bold leading-[61px] text-[#083F92]">Change Password</h1>

      <div className="mx-auto max-w-[420px] rounded-[12px] bg-white p-8">
        <SetNewPasswordForm />
      </div>
    </div>
  );
}
