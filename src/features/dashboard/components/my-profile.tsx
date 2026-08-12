"use client";

import Image from "next/image";
import Link from "next/link";
import EditProfileModal from "@/features/dashboard/components/edit-profile-modal";
import { MY_HISTORY_ROUTE, REGISTERED_TOURNAMENTS_ROUTE } from "@/config/routes";
import { useMyProfile } from "@/features/dashboard/hooks/use-my-profile";
import { Skeleton } from "@/components/ui/skeleton";

function ParentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="5" r="3" fill="white" />
      <path d="M4 15.5C4 12.5 6.2 10.5 9 10.5C11.8 10.5 14 12.5 14 15.5" fill="white" />
    </svg>
  );
}

function RatingStarIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <path
        d="M10 1.5L12.163 7.26L18.5 7.635L13.75 11.74L15.326 18L10 14.635L4.674 18L6.25 11.74L1.5 7.635L7.837 7.26L10 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TournamentIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 4C11.5 4 9.5 6 9.5 8.5C9.5 10.5 10.5 12 12 13L10.5 18H17.5L16 13C17.5 12 18.5 10.5 18.5 8.5C18.5 6 16.5 4 14 4Z"
        fill="white"
      />
      <path d="M8 18H20V21C20 23 18 24.5 16 24.5H12C10 24.5 8 23 8 21V18Z" fill="white" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M8 7H20V10H17V20H11V10H8V7Z"
        fill="white"
      />
      <path d="M6 20H22V23H6V20Z" fill="white" />
      <path
        d="M12 4H16V7H12V4Z"
        fill="white"
      />
      <path
        d="M13.5 12L15.5 14.5L13.5 17V12Z"
        fill="white"
      />
    </svg>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#083F92]">
        {icon}
      </div>
      <h3 className="text-center text-[22px] font-bold leading-[30px] text-[#151515]">{title}</h3>
      <p className="w-full text-center text-2xl font-semibold leading-[37px] tracking-[-0.0041em] text-[#181818]">
        {value}
      </p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="flex h-[207px] flex-col items-center justify-center gap-4 rounded-[12px] bg-white px-6 py-6 transition hover:bg-[#F7F6FF]"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="flex h-[207px] flex-col items-center justify-center gap-4 rounded-[12px] bg-white px-6 py-6">
      {content}
    </div>
  );
}

export default function MyProfile() {
  const { profile, isPending, isUpdating, isEditOpen, openEditProfile, closeEditProfile, saveProfile } = useMyProfile();

  const stats = [
    { label: "USER ID", value: profile.userId },
    { label: "Gender", value: profile.gender },
    { label: "School", value: profile.school },
    { label: "City", value: profile.city },
    { label: "Date Of Birth", value: profile.dateOfBirth },
  ];

  const parentRows = [
    { label: profile.parent.name, bg: "bg-[#F2F7FF]" },
    { label: profile.parent.email, bg: "bg-[#DFEBFF]" },
    { label: profile.parent.phone, bg: "bg-[#F2F7FF]" },
  ];

  return (
    <>
    <div className="mx-auto max-w-[1240px] px-6 pb-12 pt-8 lg:px-0">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-[45px] font-bold md:leading-[61px] text-[#083F92]">My Profile</h1>
          <p className="text-lg md:text-[22px] md:leading-[30px] text-[#151515]">Manage your personal information</p>
        </div>
        <button
          type="button"
          onClick={openEditProfile}
          className="flex h-10 w-[122px] shrink-0 items-center justify-center rounded-[6px] bg-[#083F92] text-base font-medium leading-[25px] tracking-[-0.0041em] text-white hover:bg-[#062f6e] transition-colors self-start sm:self-center cursor-pointer"
        >
          Edit profile
        </button>
      </div>

      <div className="relative mb-6 mt-20 lg:mt-24">
        {/* Profile Card */}
        <div className="relative rounded-[12px] bg-white p-6 pt-24 pb-8 lg:py-[25px] lg:pl-[282px] lg:pr-8 shadow-sm lg:min-h-[155px] flex flex-col justify-center">
          
          {/* Avatar Container */}
          <div className="absolute -top-[70px] left-1/2 -translate-x-1/2 h-[140px] w-[140px] overflow-hidden rounded-full border-8 border-[#083F92] bg-[#eaeaea] lg:absolute lg:left-[52px] lg:-top-[83px] lg:translate-x-0 lg:h-[198px] lg:w-[198px] lg:border-[10px] z-10 shadow-md">
            {isPending ? (
               <Skeleton className="h-full w-full rounded-full" />
            ) : (
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                className="object-cover"
                sizes="(max-w-1024px) 140px, 198px"
              />
            )}
          </div>

          {/* Profile Details */}
          <div className="w-full flex flex-col items-center lg:items-start">
            {isPending ? (
              <Skeleton className="h-[43px] w-64 mb-3" />
            ) : (
              <h2 className="text-2xl lg:text-[32px] font-semibold lg:leading-[43px] text-[#292D32] text-center lg:text-left break-words max-w-full">
                {profile.name}
              </h2>
            )}

            {/* Stats Flex Row */}
            <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-4">
              {isPending
                ? [...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center lg:items-start gap-2 border-r border-[#3D3775]/20 pr-6 mr-6 last:border-r-0 last:mr-0 last:pr-0"
                    >
                      <Skeleton className="h-[19px] w-16" />
                      <Skeleton className="h-[32px] w-24" />
                    </div>
                  ))
                : stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="flex flex-col items-center lg:items-start border-r border-[#3D3775]/20 pr-6 mr-6 last:border-r-0 last:mr-0 last:pr-0"
                    >
                      <span className="text-sm font-medium leading-[19px] text-[#083F92]">{stat.label}</span>
                      <span className="text-lg lg:text-2xl font-semibold leading-8 text-[#083F92] break-words text-center lg:text-left max-w-full">
                        {stat.value}
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isPending ? (
          <>
            <Skeleton className="h-[207px] w-full rounded-[12px]" />
            <Skeleton className="h-[207px] w-full rounded-[12px]" />
          </>
        ) : (
          <>
            <SummaryCard
              icon={<TournamentIcon />}
              title="Enrolled Tournaments"
              value={String(profile.enrolledTournaments).padStart(2, "0")}
              href={REGISTERED_TOURNAMENTS_ROUTE}
            />
            <SummaryCard
              icon={<HistoryIcon />}
              title="My History"
              value={profile.historyScore}
              href={MY_HISTORY_ROUTE}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex h-[289px] flex-col rounded-[12px] bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#083F92]">
              <ParentIcon />
            </div>
            <h3 className="text-[22px] font-bold leading-[30px] text-[#151515]">Parent Information</h3>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden bg-[#D2D2D2]">
            {isPending ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className={`flex flex-1 items-center px-[15px] ${i % 2 === 0 ? "bg-[#F2F7FF]" : "bg-[#DFEBFF]"}`}>
                   <Skeleton className="h-[24px] w-48" />
                </div>
              ))
            ) : (
              parentRows.map((row) => (
                <div
                  key={row.label}
                  className={`flex flex-1 items-center px-[15px] text-lg font-medium leading-6 text-[#292D32] ${row.bg}`}
                >
                  {row.label}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex h-[289px] flex-col rounded-[12px] bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#083F92]">
              <RatingStarIcon className="text-white" />
            </div>
            <h3 className="text-[22px] font-bold leading-[30px] text-[#151515]">Current Rating</h3>
          </div>

          <div className="relative flex-1 overflow-hidden rounded-[24px] bg-[#083F92]">
            <div className="absolute right-[43px] top-[43px] flex h-[188px] w-[188px] items-center justify-center rounded-full bg-[rgba(244,244,244,0.1)]">
              <RatingStarIcon className="h-[102px] w-[102px] text-[#083F92]" />
            </div>
            {isPending ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-[49px] w-24 bg-white/40" />
              </div>
            ) : (
              <p className="absolute inset-0 flex items-center justify-center text-[36px] font-semibold leading-[49px] text-white">
                {profile.currentRating}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>

      {isEditOpen ? (
        <EditProfileModal profile={profile} isUpdating={isUpdating} onClose={closeEditProfile} onSave={saveProfile} />
      ) : null}
    </>
  );
}
