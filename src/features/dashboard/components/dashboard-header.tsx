import Image from "next/image";
import Link from "next/link";
import NotificationPopup from "@/features/dashboard/components/notification-popup";
import ProfileMenu from "@/features/dashboard/components/profile-menu";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#DADADA] bg-white">
      <div className="mx-auto flex h-[104px] max-w-[1240px] items-center justify-between px-6 lg:px-0">
        <Link href="/dashboard" className="relative h-[68px] w-[134px]">
          <Image
            src="/images/logo.png"
            alt="WSCF - Wisconsin Scholastic Chess Federation"
            fill
            className="object-contain object-left"
            priority
          />
        </Link>

        <div className="flex items-center gap-2.5">
          <NotificationPopup />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
