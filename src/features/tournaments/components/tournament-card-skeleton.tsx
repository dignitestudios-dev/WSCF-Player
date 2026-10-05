import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading placeholder for a tournament row. It is built on the same box as the
 * real card (`TournamentCard` and the registered-tournaments card), so nothing
 * moves when the data arrives:
 *
 *   phone  icon + title/meta on top, a full-width button underneath
 *   md+    one row of fixed height, the button floated to the right edge
 *
 * `bordered` is the blue outline the real cards have.
 */
export default function TournamentCardSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-[12px] border border-[#083F92]/20 bg-white p-4 shadow-sm md:h-[110px] md:p-6 ${className}`}
    >
      <div className="flex min-w-0 items-start gap-4 md:pr-52">
        <Skeleton className="h-11 w-11 shrink-0 rounded-full md:h-[53px] md:w-[53px]" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-5 w-3/4 max-w-[260px] md:h-6" />
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 md:mt-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <Skeleton className="mt-4 h-12 w-full rounded-full md:absolute md:right-6 md:top-1/2 md:mt-0 md:h-14 md:w-[136px] md:-translate-y-1/2" />
    </div>
  );
}
