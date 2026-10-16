import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The "‹ Back" link at the top of a dashboard page.
 *
 * Looks like the Back link every other dashboard page already draws for itself
 * (each has its own copy of the arrow); new pages should use this one. At least
 * 44px tall, so it is a comfortable tap target on a phone.
 */
export function BackLink({
  href,
  children = "Back",
  className,
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center gap-2 pr-3 text-base font-medium leading-6 text-[#083F92] md:gap-3 md:text-lg",
        className,
      )}
    >
      <svg
        width="15"
        height="27"
        viewBox="0 0 15 27"
        fill="none"
        aria-hidden="true"
        className="h-5 w-3 shrink-0 md:h-[27px] md:w-[15px]"
      >
        <path
          d="M13 2L2 13.5L13 25"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </Link>
  );
}
