"use client";

import LoginActionButton from "@/features/auth/components/login-action-button";
import CreateTeamModal from "@/features/auth/components/create-team-modal";
import LoginShell from "@/features/auth/components/login-shell";
import {
  ChessIcon,
  SearchIcon,
  TeamIcon,
  UserIcon,
  UsersIcon,
} from "@/features/auth/components/login-icons";
import { useLoginHub } from "@/features/auth/hooks/use-login-hub";

const iconMap = {
  user: UserIcon,
  chess: ChessIcon,
  search: SearchIcon,
  team: TeamIcon,
  users: UsersIcon,
};

export default function LoginHub() {
  const {
    topActions,
    mainActions,
    isCreateTeamModalOpen,
    openCreateTeamModal,
    closeCreateTeamModal,
  } = useLoginHub();

  function renderIcon(icon: keyof typeof iconMap) {
    const Icon = iconMap[icon];
    return <Icon />;
  }

  return (
    <LoginShell>
      <div className="flex w-full flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {topActions.map((action) => (
            <LoginActionButton
              key={action.id}
              label={action.label}
              icon={renderIcon(action.icon)}
              href={action.href}
            />
          ))}
        </div>

        {mainActions.map((action) => (
          <LoginActionButton
            key={action.id}
            label={action.label}
            icon={renderIcon(action.icon)}
            href={action.href}
            onClick={
              action.action === "open-create-team-modal"
                ? openCreateTeamModal
                : undefined
            }
          />
        ))}
      </div>

      <CreateTeamModal open={isCreateTeamModalOpen} onClose={closeCreateTeamModal} />
    </LoginShell>
  );
}
