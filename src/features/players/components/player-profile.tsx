"use client";

import { useRouter } from "next/navigation";
import { usePlayerProfile } from "@/features/players/hooks/use-player-profile";
import { Skeleton } from "@/components/ui/skeleton";

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
  const router = useRouter();
  const { player, isLoading } = usePlayerProfile();

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#F7F6FF]">
        <div className="relative mx-auto w-full max-w-[1240px] px-6 pb-16 pt-10 xl:px-0 xl:pt-[43px]">
          <Skeleton className="mb-[42px] h-[30px] w-24 rounded" />
          <Skeleton className="mb-[34px] h-[61px] w-96 rounded" />

          <div className="relative mb-6 mt-20 lg:mt-24">
            <div className="relative rounded-[12px] bg-white p-6 lg:p-8 shadow-sm lg:min-h-[155px] flex flex-col justify-center">
              <div className="w-full flex flex-col items-center lg:items-start">
                <Skeleton className="h-[43px] w-64 mb-3" />
                <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center lg:items-start gap-2 border-r border-[#3D3775]/20 pr-6 mr-6 last:border-r-0 last:mr-0 last:pr-0"
                    >
                      <Skeleton className="h-[19px] w-16" />
                      <Skeleton className="h-[32px] w-24" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 xl:flex-row xl:gap-6">
            <div className="w-full shrink-0 rounded-[24px] bg-white p-6 xl:w-[605px]">
              <div className="mb-4 flex items-center gap-3">
                <Skeleton className="h-[35px] w-[35px] rounded-full" />
                <Skeleton className="h-[30px] w-48 rounded" />
              </div>
              <Skeleton className="h-[179px] w-full rounded-[24px]" />
            </div>

            <div className="w-full bg-white rounded-[24px] p-6 xl:w-[611px]">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-12 w-full rounded" />
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={`list-${i}`} className="h-10 w-full rounded" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "USER ID", value: player.userId },
    { label: "City", value: player.city },
    { label: "Date Of Birth", value: player.dateOfBirth },
    { label: "School", value: player.school && player.school !== "-" && player.school !== "N/A" ? player.school : "Not assigned" },
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
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-[42px] inline-flex items-center gap-3 text-[22px] font-medium leading-[30px] text-[#083F92] hover:opacity-80 transition-opacity"
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
        </button>

        <h1 className="mb-[34px] text-[45px] font-bold leading-[61px] text-[#083F92]">
          Player Rating Lookup
        </h1>

        <div className="relative mb-6 mt-20 lg:mt-24">
          {/* Profile Card */}
          <div className="relative rounded-[12px] bg-white p-6 lg:p-8 shadow-sm lg:min-h-[155px] flex flex-col justify-center">

            {/* Profile Details */}
            <div className="w-full flex flex-col items-center lg:items-start">
              <h2 className="text-2xl lg:text-[32px] font-semibold lg:leading-[43px] text-[#292D32] text-center lg:text-left break-words max-w-full">
                {player.name}
              </h2>

              {/* Stats Flex Row */}
              <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-y-4">
                {stats.map((stat) => (
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

            {player.tournaments.map((tournament: any, index: number) => (
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
