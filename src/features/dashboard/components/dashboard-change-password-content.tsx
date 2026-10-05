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
    <div className="mx-auto max-w-[1240px] px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-8 lg:px-0">
      <Link
        href={SETTINGS_ROUTE}
        className="mb-6 inline-flex min-h-11 items-center gap-2 pr-3 text-base font-medium leading-6 text-[#083F92] md:gap-3 md:pr-0 md:text-lg"
      >
        <BackIcon />
        Back
      </Link>

      <h1 className="mb-8 text-3xl font-bold leading-10 md:text-[45px] md:leading-[61px] text-[#083F92]">Change Password</h1>

      <div className="mx-auto max-w-[420px] rounded-[12px] bg-white p-8">
        <SetNewPasswordForm />
      </div>
    </div>
  );
}
