"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { tournamentRegistrationSchema } from "@/features/tournaments/schemas/tournament-registration.schema";

function getDefaultValues(user: User | null): TournamentRegistrationFields {
  return {
    playerFirstName: user?.firstName ?? "",
    playerLastName: user?.lastName ?? "",
    grade: "",
    teamName: "",
    city: "",
    division: "",
    parentFirstName: "",
    parentLastName: "",
    parentPhone: "",
    parentEmail: user?.email ?? "",
  };
}

export function useTournamentRegistration(tournament: TournamentRegistrationTarget) {
  const { user } = useAuth();
  const [step, setStep] = useState<TournamentRegistrationStep>("registration");

  const form = useForm<TournamentRegistrationFields>({
    resolver: zodResolver(tournamentRegistrationSchema),
    defaultValues: getDefaultValues(user),
  });

  function proceedToPayment() {
    setStep("payment");
  }

  function completePayment() {
    setStep("success");
  }

  function onRegistrationSubmit() {
    proceedToPayment();
  }

  return {
    tournament,
    step,
    form,
    onRegistrationSubmit,
    completePayment,
  };
}
