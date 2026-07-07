"use client";

import { useEffect } from "react";
import { policyContent } from "@/features/dashboard/data/settings-policy-content";

interface PolicyModalProps {
  type: PolicyModalType;
  onClose: () => void;
}

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

function PolicySectionBlock({ section }: { section: PolicySection }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-bold leading-[22px] tracking-[-0.0041em] text-[#181818]">
        {section.title}
      </h3>

      {section.paragraphs?.map((paragraph) => (
        <p
          key={paragraph}
          className="text-base font-semibold leading-[22px] tracking-[-0.0041em] text-[#181818]"
        >
          {paragraph}
        </p>
      ))}

      {section.bullets ? (
        <ul className="list-disc space-y-2 pl-5">
          {section.bullets.map((bullet) => (
            <li
              key={bullet}
              className="text-base font-semibold leading-[22px] tracking-[-0.0041em] text-[#181818]"
            >
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function PolicyModal({ type, onClose }: PolicyModalProps) {
  const content = policyContent[type];

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative flex w-full max-w-[761px] flex-col overflow-hidden rounded-[12px]"
        style={{
          background:
            "linear-gradient(0deg, rgba(61, 55, 117, 0.2) -11.33%, rgba(61, 55, 117, 0) 32.37%), #FFFFFF",
          maxHeight: "min(812px, 90vh)",
        }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="policy-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center text-[#181818]"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        <h2
          id="policy-modal-title"
          className="px-[60px] pt-[60px] text-center text-[32px] font-bold capitalize leading-[43px] tracking-[-0.018em] text-[#181818]"
        >
          {content.title}
        </h2>

        <div className="overflow-y-auto px-[60px] pb-[60px] pt-[31px]">
          <div className="flex flex-col gap-6">
            {content.sections.map((section) => (
              <PolicySectionBlock key={section.title} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
