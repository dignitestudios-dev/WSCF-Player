"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type Slot = number | "gap-start" | "gap-end";

/**
 * Which page buttons to show: the first, the last, the current page and one on
 * each side, with a gap marker where pages are skipped.
 *
 *   page 1 of 90   ->  1 2 3 4 5 … 90
 *   page 45 of 90  ->  1 … 44 45 46 … 90
 *   page 90 of 90  ->  1 … 86 87 88 89 90
 *
 * Always the same number of slots, so the control does not jump around as you
 * page. This replaces printing every page number, which overflowed the screen
 * at six pages and would have been hundreds of buttons for a real player list.
 */
function pageSlots(current: number, total: number): Slot[] {
  const SLOTS = 7;
  if (total <= SLOTS) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "gap-end", total];
  if (current >= total - 3)
    return [1, "gap-start", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "gap-start", current - 1, current, current + 1, "gap-end", total];
}

/**
 * Page controls for the player lists. Built on the shadcn Pagination.
 *
 *   md and up   numbered pages with gaps, as above
 *   phone       "Previous · Page 2 of 6 · Next" — two big targets instead of a row
 *               of small numbers, which is also how a phone list is paged
 */
export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) {
  if (totalPages <= 1) return null;

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;
  const go = (page: number) => {
    onPageChange(Math.min(Math.max(page, 1), totalPages));
    // A new page starts at its top. Without this, tapping Next at the bottom of
    // page 1 leaves you looking at the bottom of page 2.
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Phone */}
      <Pagination className="md:hidden">
        <PaginationContent className="w-full justify-between gap-2">
          <PaginationItem>
            <PaginationLink
              size="default"
              aria-label="Previous page"
              disabled={isFirst}
              onClick={() => go(currentPage - 1)}
              className="h-11 px-4 text-sm font-medium"
            >
              <ChevronLeftIcon />
              Previous
            </PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <span
              aria-live="polite"
              className="text-sm font-medium text-[#565656]"
            >
              Page <span className="text-[#083F92]">{currentPage}</span> of{" "}
              {totalPages}
            </span>
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              size="default"
              aria-label="Next page"
              disabled={isLast}
              onClick={() => go(currentPage + 1)}
              className="h-11 px-4 text-sm font-medium"
            >
              Next
              <ChevronRightIcon />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* md and up */}
      <Pagination className="hidden md:flex">
        <PaginationContent className="gap-1.5">
          <PaginationItem>
            <PaginationLink
              aria-label="Previous page"
              disabled={isFirst}
              onClick={() => go(currentPage - 1)}
            >
              <ChevronLeftIcon />
            </PaginationLink>
          </PaginationItem>

          {pageSlots(currentPage, totalPages).map((slot) =>
            typeof slot === "number" ? (
              <PaginationItem key={slot}>
                <PaginationLink
                  isActive={slot === currentPage}
                  aria-label={`Page ${slot}`}
                  onClick={() => go(slot)}
                  className={cn(slot !== currentPage && "text-[#636363]")}
                >
                  {slot}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={slot}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationLink
              aria-label="Next page"
              disabled={isLast}
              onClick={() => go(currentPage + 1)}
            >
              <ChevronRightIcon />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
