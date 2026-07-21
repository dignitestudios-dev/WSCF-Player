"use client";

import { useState, useEffect } from "react";
import { useTournamentsQuery } from "@/features/tournaments/api/tournaments.queries";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/custom-pagination";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchButtonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#181818" strokeWidth="2" />
      <path d="M16 16L21 21" stroke="#181818" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface UpcomingTournamentsModalProps {
  onClose: () => void;
  onSelect: (tournamentId: string) => void;
}

export default function UpcomingTournamentsModal({
  onClose,
  onSelect,
}: UpcomingTournamentsModalProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { data, isPending } = useTournamentsQuery({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const tournaments = data?.data?.tournaments || [];
  const pagination = data?.pagination;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-[800px] flex-col gap-6 overflow-y-auto rounded-[12px] bg-white px-6 py-[42px] sm:px-[52px]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="upcoming-tournaments-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center text-[#181818]"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <h2
          id="upcoming-tournaments-title"
          className="text-center text-[32px] font-semibold leading-[43px] text-[#181818]"
        >
          Upcoming Tournaments
        </h2>

        <div className="relative h-12 w-full">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tournaments"
            className="h-12 w-full rounded-[24px] border border-[#DADADA] bg-white pl-6 pr-14 text-sm font-light text-[#181818] outline-none"
          />
          <div className="absolute right-3 top-1 flex h-10 w-10 items-center justify-center">
            <SearchButtonIcon />
          </div>
        </div>

        {isPending ? (
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[68px] w-full rounded-[12px]" />
            ))}
          </div>
        ) : tournaments.length === 0 ? (
          <div className="flex justify-center p-8 text-[#181818]/60">
            No tournaments found.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tournaments.map((tournament) => (
              <button
                key={tournament._id}
                onClick={() => onSelect(tournament._id)}
                className="flex items-center justify-between rounded-[12px] border border-[#DADADA] bg-white p-4 text-left transition hover:bg-[#F7F6FF]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-[#181818]">
                    {tournament.title}
                  </p>
                  <p className="mt-1 truncate text-sm text-[#727272]">
                    {tournament.date} • {tournament.location}
                  </p>
                </div>
                <div className="shrink-0 pl-4">
                  <span className="text-sm font-medium text-[#083F92]">Select</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-end">
            <CustomPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
