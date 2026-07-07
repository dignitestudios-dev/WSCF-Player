"use client";

import Link from "next/link";
import { cn } from "@/utils/cn";

interface LoginActionButtonProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function LoginActionButton({
  label,
  icon,
  href,
  onClick,
  className,
}: LoginActionButtonProps) {
  const content = (
    <span className="flex items-center justify-center gap-2.5 [&_svg]:h-5 [&_svg]:w-5">
      {icon}
      <span className="text-[14px] font-medium capitalize leading-5 text-[#fff]/80">
        {label}
      </span>
    </span>
  );

  const baseClass = cn(
    "flex h-[58px] w-full items-center justify-center rounded-[36px] bg-[#083F92] px-6 shadow-[0px_4px_4px_rgba(6,62,145,0.25)] transition-colors hover:bg-[#063875]",
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClass}>
      {content}
    </button>
  );
}
