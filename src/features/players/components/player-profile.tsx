"use client";

import Image from "next/image";
import Link from "next/link";
import { usePlayerProfile } from "@/features/players/hooks/use-player-profile";

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col justify-center">
      <span className="text-sm font-medium leading-[19px] text-[#083F92]">{label}</span>
      <span className="text-2xl font-semibold leading-8 text-[#083F92]">{value}</span>
    </div>
  );
}

function StatDivider() {
  return <div className="h-6 w-0.5 shrink-0 bg-[#3D3775]" />;
}

function SortArrow() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 10L12 14L16 10"
        stroke="#EBEBEB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

export default function PlayerProfile() {
  const { player, backHref } = usePlayerProfile();

  const stats = [
    { label: "USER ID", value: player.userId },
    { label: "Gender", value: player.gender },
    { label: "School", value: player.school },
    { label: "City", value: player.city },
    { label: "Date Of Birth", value: player.dateOfBirth },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F6FF]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1240px] px-6 pb-16 pt-10 xl:px-0 xl:pt-[43px]">
        <Link
          href={backHref}
          className="mb-[42px] inline-flex items-center gap-3 text-[22px] font-medium leading-[30px] text-[#083F92]"
        >
          <svg width="15" height="27" viewBox="0 0 15 27" fill="none" aria-hidden="true">
            <path
              d="M13 2L2 13.5L13 25"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back
        </Link>

        <h1 className="mb-[34px] text-[45px] font-bold leading-[61px] text-[#083F92]">
          Player Rating Lookup
        </h1>

        <div className="relative mb-8 min-h-[420px] sm:h-[278px] sm:min-h-0">
          <div className="absolute left-0 right-0 top-[83px] h-[195px] rounded-[24px] bg-white max-sm:bottom-0 max-sm:top-auto" />

          <div className="absolute left-1/2 top-0 z-10 h-[198px] w-[198px] -translate-x-1/2 overflow-hidden rounded-full border-[10px] border-[#083F92] bg-[#eaeaea] sm:left-[52px] sm:translate-x-0">
            <Image
              src={player.avatarUrl}
              alt={player.name}
              fill
              className="object-cover"
              sizes="198px"
            />
          </div>

          <div className="absolute left-0 right-0 top-[220px] px-2 sm:left-[282px] sm:top-[128px] sm:w-auto sm:px-0">
            <div className="flex flex-col gap-3">
              <h2 className="text-[32px] font-semibold leading-[43px] text-[#292D32]">
                {player.name}
              </h2>

              <div className="flex flex-wrap items-center gap-4">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="flex items-center gap-4">
                    <ProfileStat label={stat.label} value={stat.value} />
                    {index < stats.length - 1 && <StatDivider />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:gap-6">
          <div className="w-full shrink-0 rounded-[24px] bg-white p-6 xl:w-[605px]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[#083F92] shadow-[1px_4px_8px_rgba(61,55,117,0.3)]">
                <RatingStarIcon className="text-white" />
              </div>
              <h3 className="text-[22px] font-bold leading-[30px] text-[#3D3775]">Current Rating</h3>
            </div>

            <div className="relative h-[179px] overflow-hidden rounded-[24px] bg-[#083F92]">
              <div className="absolute right-[43px] top-[43px] flex h-[188px] w-[188px] items-center justify-center rounded-full bg-[rgba(244,244,244,0.1)]">
                <RatingStarIcon className="h-[102px] w-[102px] text-[#083F92]" />
              </div>
              <p className="absolute inset-0 flex items-center justify-center text-[36px] font-semibold leading-[49px] text-white">
                {player.currentRating}
              </p>
            </div>
          </div>

          <div className="w-full overflow-x-auto bg-white xl:w-[611px]">
            <div className="min-w-[611px]">
              <div className="flex items-center gap-8 rounded-t-[12px] bg-[#083F92] px-5 py-3 text-base font-semibold leading-[22px] text-white">
              <span className="w-[158px] shrink-0">Tournaments</span>
              <span className="flex w-[80px] shrink-0 items-center">
                Date
                <SortArrow />
              </span>
              <span className="flex w-[80px] shrink-0 items-center">
                Rating
                <SortArrow />
              </span>
              <span className="ml-auto w-[109px] shrink-0 text-right">Rating change</span>
            </div>

            {player.tournaments.map((tournament, index) => (
              <div
                key={tournament.id}
                className={`flex items-center gap-8 px-5 py-[11px] text-base font-semibold leading-[22px] text-[#151515] ${
                  index < player.tournaments.length - 1 ? "border-b border-[#DADADA]" : ""
                }`}
              >
                <span className="w-[158px] shrink-0">{tournament.name}</span>
                <span className="w-[80px] shrink-0">{tournament.date}</span>
                <span className="w-[80px] shrink-0">{tournament.rating}</span>
                <span className="ml-auto w-[109px] shrink-0 text-right">{tournament.ratingChange}</span>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
