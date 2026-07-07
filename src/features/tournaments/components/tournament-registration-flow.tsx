"use client";

import { useRouter } from "next/navigation";
import { REGISTERED_TOURNAMENTS_ROUTE } from "@/config/routes";
import TournamentPaymentModal from "@/features/tournaments/components/tournament-payment-modal";
import TournamentPaymentSuccessModal from "@/features/tournaments/components/tournament-payment-success-modal";
import TournamentRegistrationModal from "@/features/tournaments/components/tournament-registration-modal";
import { useTournamentRegistration } from "@/features/tournaments/hooks/use-tournament-registration";

interface TournamentRegistrationFlowProps {
  tournament: TournamentRegistrationTarget;
  onClose: () => void;
}

export default function TournamentRegistrationFlow({
  tournament,
  onClose,
}: TournamentRegistrationFlowProps) {
  const router = useRouter();
  const { step, form, onRegistrationSubmit, completePayment } = useTournamentRegistration(tournament);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  function handleComplete() {
    onClose();
    router.push(REGISTERED_TOURNAMENTS_ROUTE);
  }

  if (step === "registration") {
    return (
      <TournamentRegistrationModal
        onClose={onClose}
        onSubmit={onRegistrationSubmit}
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
      />
    );
  }

  if (step === "payment") {
    return (
      <TournamentPaymentModal tournament={tournament} onClose={onClose} onPay={completePayment} />
    );
  }

  return <TournamentPaymentSuccessModal tournament={tournament} onClose={handleComplete} />;
}
