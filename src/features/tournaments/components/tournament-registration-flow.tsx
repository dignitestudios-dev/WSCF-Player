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
  const { step, form, fields, isFieldsPending, isRegistering, onRegistrationSubmit, completePayment } = useTournamentRegistration(tournament);

  const {
    register,
    handleSubmit,
    control,
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
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        fields={fields}
        isFieldsPending={isFieldsPending}
        isRegistering={isRegistering}
      />
    );
  }

  if (step === "payment") {
    return (
      <TournamentPaymentModal tournament={tournament} onClose={onClose} onPay={completePayment} />
    );
  }

  if (step === "registration-success") {
    return <TournamentPaymentSuccessModal tournament={tournament} onClose={handleComplete} isRegistrationOnly={true} />;
  }

  return <TournamentPaymentSuccessModal tournament={tournament} onClose={handleComplete} />;
}
