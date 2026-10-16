"use client";

import { ExternalLink } from "lucide-react";
import { ResponsiveDialog, ResponsiveDialogContent } from "@/components/ui/responsive-dialog";

interface CreateTeamModalProps {
  open: boolean;
  onClose: () => void;
}

// Where each kind of team starts. Both are forms run outside this platform.
const SCHOOL_TEAM_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf2fPTssRsAe329WPbIyEtDwJWigzab0ROShuXmiwhty-WuaQ/viewform?usp=dialog";
const CLUB_TEAM_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdAgoAfIHHyHCanU0rHj0OhCRQBLWEjc7icw9mJZX7q6gz3Hw/viewform?usp=dialog";

const SCHOOL_STEPS = [
  "Have each of your parents go to WSCF registration sign up and register as a parent. Then have them sign up for their child as a player.",
  "Send a list of players in your club to your principal who will then verify them with an email to us with the list that those students attend that school.",
  "Once our admin receives this list they will add team code to your player’s profile.",
  "Parents will get an email confirming that your player(s) has been added to your team.",
  "You then submit the Safe Play document",
];

const CLUB_STEPS = [
  "Have each of your parents go to WSCF registration sign up and register as a parent. Then have them sign up for their child as a player.",
  "You submit to Admin the Safe Play document",
  "You submit to Admin the list of your students.",
  "Direct your parents to the Parent Confirmation letter.",
  "You submit a picture of the players at your first four sessions with (Left to right name designation)",
  "Once Admin receives these three documents then those players in both pictures and have parent commitments admin will assign team code to each of your players’ profile. (please note players must attend at least two sessions in a month before they can be added to a team)",
];

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="flex list-decimal flex-col gap-2 pl-6 text-base leading-[22px] tracking-[-0.014em] text-black marker:font-semibold">
      {items.map((item) => (
        <li key={item} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  );
}

function FormLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-[#083F92] px-5 text-sm font-semibold text-white shadow-[0px_4px_4px_rgba(61,55,117,0.25)] transition-colors hover:bg-[#063875]"
    >
      {label}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

/**
 * How a team is formed. Teams are requested outside the platform — through a
 * Google form that admin works from — so this explains the steps for each kind
 * of team and links to the right form. It does not create anything itself.
 */
export default function CreateTeamModal({ open, onClose }: CreateTeamModalProps) {
  if (!open) return null;

  return (
    <ResponsiveDialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <ResponsiveDialogContent
        showCloseButton={false}
        className="flex max-h-[88dvh] w-full max-w-[640px] flex-col gap-0 overflow-hidden rounded-xl border-none bg-white p-0 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] !outline-none"
        mobileClassName="gap-0 px-0 pt-0"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 hidden h-8 w-8 items-center justify-center rounded-md bg-white text-[#181818] transition-colors hover:bg-zinc-100 sm:flex"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex flex-col gap-6 overflow-y-auto overscroll-contain px-5 pb-8 pt-6 sm:px-8 sm:pt-8">
          <h2
            id="create-team-title"
            className="pr-8 text-2xl font-bold leading-8 tracking-[-0.018em] text-[#181818] sm:text-[28px] sm:leading-[38px]"
          >
            WSCF Team Formation
          </h2>

          <p className="text-base leading-[22px] tracking-[-0.014em] text-black">
            In the past teams were simple. If you had two players from the same school or club
            you had a team. With recent challenges to integrity of team formation, we have made
            the following types of teams.
          </p>

          <section className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold leading-7 text-[#083F92]">School teams</h3>
            <p className="text-base leading-[22px] tracking-[-0.014em] text-black">
              If all your players are from the same school, then please take the following steps.
            </p>
            <Steps items={SCHOOL_STEPS} />
            <p className="mt-1 text-base leading-[22px] tracking-[-0.014em] text-black">
              To start the process go to this link:
            </p>
            <FormLink href={SCHOOL_TEAM_FORM_URL} label="Open the School Team form" />
          </section>

          <section className="flex flex-col gap-3 border-t border-[#E4E4EC] pt-6">
            <h3 className="text-xl font-semibold leading-7 text-[#083F92]">
              Independent Club Teams
            </h3>
            <Steps items={CLUB_STEPS} />
            <p className="mt-1 text-base leading-[22px] tracking-[-0.014em] text-black">
              Please start the process here:
            </p>
            <FormLink href={CLUB_TEAM_FORM_URL} label="Open the Independent Club Team form" />
          </section>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
