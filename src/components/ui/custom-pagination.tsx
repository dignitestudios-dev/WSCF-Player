"use client";

import React from "react";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true" className={className}>
      <path d="M7 1L1 7L7 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none" aria-hidden="true" className={className}>
      <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CustomPagination({ currentPage, totalPages, onPageChange }: CustomPaginationProps) {
  if (totalPages <= 1) return null;

  // Simple array of pages for now (assuming totalPages isn't extremely large)
  // In a production app with many pages, you'd want ellipsis logic here.
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
        className="flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full bg-[#EDEDED] text-[#919191] transition-colors hover:text-[#083F92] disabled:pointer-events-none disabled:opacity-50"
      >
        <ChevronLeftIcon />
      </button>

      <div className="flex h-[43px] items-center rounded-full bg-[#EDEDED] px-1.5">
        {pages.map((p) => {
          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`flex h-[33px] min-w-[33px] items-center justify-center rounded-full px-2 text-[16px] transition-colors ${
                isActive ? "bg-[#083F92] text-white" : "text-[#636363] hover:text-[#083F92]"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
        className="flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full bg-[#EDEDED] text-[#083F92] transition-colors hover:bg-[#E5E5E5] disabled:pointer-events-none disabled:opacity-50"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
