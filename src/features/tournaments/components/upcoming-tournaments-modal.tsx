"use client";

import { useState, useEffect } from "react";
import { useTournamentsQuery } from "@/features/tournaments/api/tournaments.queries";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

  const { data, isPending } = useTournamentsQuery({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const tournaments = data?.data?.tournaments || [];
  const pagination = data?.pagination;

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent 
        showCloseButton={false}
        className="flex max-h-[90vh] w-full max-w-[800px] flex-col gap-6 overflow-y-auto rounded-[12px] bg-white px-6 py-[42px] sm:px-[52px] border-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
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
          {search ? (
            <button
              type="button"
              aria-label="Clear search"
              onMouseDown={(event) => {
                event.preventDefault();
                setSearch('');
              }}
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#ADADAD] transition-colors hover:bg-[#F2F2F2] hover:text-[#151515]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
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
      </DialogContent>
    </Dialog>
  );
}
