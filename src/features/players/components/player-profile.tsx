"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { usePlayerProfile } from "@/features/players/hooks/use-player-profile";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";


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

function PlayerProfileContent() {
  const router = useRouter();
  const { player, isLoading } = usePlayerProfile();

  if (isLoading) {
    return (
      <div className="relative min-h-dvh overflow-hidden bg-[#F7F6FF]">
        <div className="relative mx-auto w-full max-w-[1240px] px-4 pb-10 pt-4 md:px-6 md:pb-16 md:pt-10 xl:px-0 xl:pt-[43px]">
          <Skeleton className="mb-[42px] h-[30px] w-24 rounded" />
          <Skeleton className="mb-[34px] h-[61px] w-96 rounded" />

          <div className="relative mb-6 mt-4 md:mt-20 lg:mt-24">
            <div className="relative rounded-[12px] bg-white p-6 lg:p-8 shadow-sm lg:min-h-[155px] flex flex-col justify-center">
              <div className="w-full flex flex-col items-center lg:items-start">
                <Skeleton className="h-[43px] w-64 mb-3" />
                <div className="mt-3 grid w-full grid-cols-2 gap-2 lg:flex lg:w-auto lg:flex-wrap lg:items-center lg:justify-start lg:gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center lg:items-start gap-2 min-w-0 rounded-xl bg-[#F7F6FF] px-3 py-3 last:odd:col-span-2 lg:rounded-none lg:bg-transparent lg:p-0 lg:border-r lg:border-[#3D3775]/20 lg:pr-6 lg:mr-6 lg:last:border-r-0 lg:last:mr-0 lg:last:pr-0"
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
    { label: "Grade", value: player.grade },
    { label: "City", value: player.city },
    { label: "Date Of Birth", value: player.dateOfBirth },
    {
      label: "Team",
      value:
        player.team && player.team !== "-" && player.team !== "N/A"
          ? player.team
          : "Not assigned",
    },
  ];

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#F7F6FF]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1240px] px-4 pb-10 pt-4 md:px-6 md:pb-16 md:pt-10 xl:px-0 xl:pt-[43px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-3 inline-flex min-h-11 items-center gap-2 pr-3 text-base font-medium leading-6 text-[#083F92] transition-opacity hover:opacity-80 md:mb-[42px] md:gap-3 md:text-[22px] md:leading-[30px]"
        >
          <svg width="15" height="27" viewBox="0 0 15 27" fill="none" aria-hidden="true" className="h-5 w-3 md:h-[27px] md:w-[15px]">
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

        <h1 className="mb-5 text-3xl font-bold leading-10 text-[#083F92] md:mb-[34px] md:text-[45px] md:leading-[61px]">
          Player Rating Lookup
        </h1>

        <div className="relative mb-6 mt-4 md:mt-20 lg:mt-24">
          {/* Profile Card */}
          <div className="relative rounded-[12px] bg-white p-6 lg:p-8 shadow-sm lg:min-h-[155px] flex flex-col justify-center">

            {/* Profile Details */}
            <div className="w-full flex flex-col items-center lg:items-start">
              <h2 className="text-2xl lg:text-[32px] font-semibold lg:leading-[43px] text-[#292D32] text-center lg:text-left break-words [overflow-wrap:anywhere] max-w-full">
                {player.name}
              </h2>

              {/* Stats Flex Row */}
              <div className="mt-3 grid w-full grid-cols-2 gap-2 lg:flex lg:w-auto lg:flex-wrap lg:items-center lg:justify-start lg:gap-2">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center lg:items-start min-w-0 rounded-xl bg-[#F7F6FF] px-3 py-3 last:odd:col-span-2 lg:rounded-none lg:bg-transparent lg:p-0 lg:border-r lg:border-[#3D3775]/20 lg:pr-6 lg:mr-6 lg:last:border-r-0 lg:last:mr-0 lg:last:pr-0 lg:max-w-[200px]"
                  >
                    <span className="text-sm font-medium leading-[19px] text-[#083F92]">{stat.label}</span>
                    <span className={`text-lg lg:text-2xl font-semibold leading-8 break-words [overflow-wrap:anywhere] text-center lg:text-left max-w-full ${stat.value === "Not assigned" ? "text-gray-400" : "text-[#083F92]"}`}>
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

          <div className="hidden w-full overflow-x-auto bg-white md:block xl:w-[611px]">
            <div className="min-w-[611px]">
              <div className="flex items-center gap-8 rounded-t-[12px] bg-[#083F92] px-5 py-3 text-base font-semibold leading-[22px] text-white">
              <span className="w-[158px] shrink-0">Tournaments</span>
              <span className="w-[80px] shrink-0">Date</span>
              <span className="w-[80px] shrink-0">Rating</span>
              <span className="ml-auto w-[109px] shrink-0 text-right">Points</span>
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
                <span className="flex w-[80px] shrink-0 items-baseline gap-1.5">
                  <span>{tournament.rating}</span>
                  {tournament.ratingChange !== null ? (
                    <span
                      className={`text-xs font-semibold ${
                        tournament.ratingChange > 0
                          ? "text-[#0F8B4C]"
                          : tournament.ratingChange < 0
                            ? "text-[#B42318]"
                            : "text-[#8C8C8C]"
                      }`}
                    >
                      {tournament.ratingChange > 0 ? "+" : ""}
                      {tournament.ratingChange}
                    </span>
                  ) : null}
                </span>
                <span className="ml-auto w-[109px] shrink-0 text-right">
                  {tournament.points}
                </span>
              </div>
            ))}

            {/* A player who has entered nothing yet, or whose tournaments have
                not had their results published, would otherwise get a heading
                row and then nothing at all. */}
            {player.tournaments.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-[#787878]">
                No completed tournaments yet.
              </div>
            ) : null}
            </div>
          </div>

          {/* phone: the same completed tournaments, one card each */}
          <div className="md:hidden">
            {player.tournaments.length === 0 ? (
              <p className="rounded-2xl bg-white px-5 py-8 text-center text-sm text-[#787878]">
                No completed tournaments yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {player.tournaments.map((tournament: any) => (
                  <li key={tournament.id}>
                    <Card className="rounded-2xl border-[#E4E4EC] p-4 shadow-none">
                      <p className="break-words text-base font-semibold leading-5 text-[#181818]">
                        {tournament.name}
                      </p>
                      <p className="mt-1 text-xs text-[#636363]">{tournament.date}</p>
                      <dl className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-[#F7F6FF] px-3 py-3 text-center">
                        <div>
                          <dt className="text-[11px] text-[#636363]">Rating</dt>
                          <dd className="flex items-baseline justify-center gap-1.5 text-sm font-semibold text-[#083F92]">
                            {tournament.rating}
                            {tournament.ratingChange !== null ? (
                              <span
                                className={`text-xs ${
                                  tournament.ratingChange > 0
                                    ? "text-[#0F8B4C]"
                                    : tournament.ratingChange < 0
                                      ? "text-[#B42318]"
                                      : "text-[#8C8C8C]"
                                }`}
                              >
                                {tournament.ratingChange > 0 ? "+" : ""}
                                {tournament.ratingChange}
                              </span>
                            ) : null}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[11px] text-[#636363]">Points</dt>
                          <dd className="text-sm font-semibold text-[#083F92]">
                            {tournament.points}
                          </dd>
                        </div>
                      </dl>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlayerProfile() {
  return (
    <Suspense fallback={null}>
      <PlayerProfileContent />
    </Suspense>
  );
}
