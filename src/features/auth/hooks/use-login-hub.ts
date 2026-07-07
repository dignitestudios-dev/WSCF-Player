"use client";

import { useState } from "react";
import {
  BECOME_MEMBER_ROUTE,
  PLAYERS_RATING_ROUTE,
  TOURNAMENT_PARTICIPANTS_ROUTE,
} from "@/config/routes";

type LoginActionIcon =
  | "user"
  | "chess"
  | "search"
  | "team"
  | "users";

interface LoginHubAction {
  id: string;
  label: string;
  icon: LoginActionIcon;
  href?: string;
  action?: "open-create-team-modal";
}

export function useLoginHub() {
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);

  function openCreateTeamModal() {
    setIsCreateTeamModalOpen(true);
  }

  function closeCreateTeamModal() {
    setIsCreateTeamModalOpen(false);
  }

  const topActions: LoginHubAction[] = [
    {
      id: "become-member",
      label: "Become A WSCF Member",
      icon: "user",
      href: BECOME_MEMBER_ROUTE,
    },
    {
      id: "already-member",
      label: "Already A Member?",
      icon: "user",
      href: "/auth/member-login",
    },
  ];

  const mainActions: LoginHubAction[] = [
    {
      id: "tournament",
      label: "Registration For A Tournament",
      icon: "chess",
      href: "/auth/member-login",
    },
    {
      id: "rating",
      label: "Players Rating Lookup",
      icon: "search",
      href: PLAYERS_RATING_ROUTE,
    },
    {
      id: "team",
      label: "Create A Team",
      icon: "team",
      action: "open-create-team-modal",
    },
    {
      id: "participants",
      label: "Current Tournament Participants",
      icon: "users",
      href: TOURNAMENT_PARTICIPANTS_ROUTE,
    },
  ];

  return {
    topActions,
    mainActions,
    isCreateTeamModalOpen,
    openCreateTeamModal,
    closeCreateTeamModal,
  };
}
