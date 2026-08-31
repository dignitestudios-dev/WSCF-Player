"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { REGISTERED_TOURNAMENTS_ROUTE } from "@/config/routes";
import {
  useEligibleDivisionsQuery,
  useTournamentRegistrationMutation,
} from "@/features/tournaments/api/tournaments.queries";
import type { AppliedCoupon } from "@/features/tournaments/api/coupons.service";

/** `price` arrives as a display string — "$5.00", or "Free". */
function parseEntryFee(price: string): number {
  if (!price || price === "Free") return 0;
  const amount = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(amount) ? amount : 0;
}

export function useTournamentRegistration(
  tournament: TournamentRegistrationTarget
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<TournamentRegistrationStep>("registration");

  // Applied on the form before submitting, so the player sees the fee reach
  // $0.00 before they commit to anything.
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  const entryFee = parseEntryFee(tournament.price);

  const { data, isPending: isDivisionsPending } = useEligibleDivisionsQuery(
    tournament.id
  );
  // Registration asks for a division and nothing else.
  const divisions = data?.data?.divisions || [];

  const registerMutation = useTournamentRegistrationMutation(tournament.id);

  // The division is the only answer the form collects.
  const resolver = useCallback(
    (values: Record<string, any>) => {
      const errors: Record<string, { type: string; message: string }> = {};
      const parsed: Record<string, any> = {};

      if (divisions && divisions.length > 0) {
        if (!values["divisionId"]) {
          errors["divisionId"] = {
            type: "validation",
            message: "Division is required",
          };
        } else {
          parsed["divisionId"] = values["divisionId"];
        }
      }

      return {
        values:
          Object.keys(errors).length > 0
            ? ({} as Record<string, any>)
            : parsed,
        errors,
      };
    },
    [divisions]
  );

  // One value, and only once the divisions have arrived — returning undefined
  // until then is what lets `values` sync the form on first open.
  const formValues = useMemo(() => {
    if (!divisions || divisions.length === 0) return undefined;
    return { divisionId: "" };
  }, [divisions]);

  // Use the `values` option (react-hook-form v7.43+) instead of
  // form.reset() in a useEffect. `values` is reactive — when it changes
  // from undefined to { fieldId: "" }, the form automatically syncs.
  // `keepDirtyValues` ensures that if the user has already typed something
  // before values update, their input is preserved.
  //
  // This fixes the first-open bug: form.reset() in useEffect fires AFTER
  // the render paint, which breaks mode:"onChange" because react-hook-form's
  // internal state gets wiped after register() has already set up handlers.
  // The `values` option integrates directly with the form lifecycle and
  // doesn't suffer from this timing issue.
  const form = useForm<Record<string, any>>({
    resolver: resolver as any,
    defaultValues: {},
    values: formValues,
    resetOptions: {
      keepDirtyValues: true,
    },
    mode: "onChange",
  });

  function proceedToPayment() {
    setStep("payment");
  }

  function completePayment() {
    setStep("success");
  }

  function completeRegistrationSuccess() {
    setStep("registration-success");
  }

  function onRegistrationSubmit(formData: Record<string, any>) {
    const divisionId = formData["divisionId"];

    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";

    // A coupon that covers the whole fee turns this into a free registration,
    // so no checkout URLs are sent — there is nothing to check out.
    const requiresPayment =
      entryFee > 0 && !appliedCoupon?.coversFullFee;

    registerMutation.mutate(
      {
        divisionId,
        ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
        ...(requiresPayment
          ? {
              successUrl: `${baseUrl}${REGISTERED_TOURNAMENTS_ROUTE}?payment=success`,
              cancelUrl: `${baseUrl}${REGISTERED_TOURNAMENTS_ROUTE}?payment=cancelled`,
            }
          : {}),
      },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
          queryClient.invalidateQueries({ queryKey: ["myTournaments"] });
          if (
            response.data?.requiresPayment &&
            response.data?.checkoutUrl
          ) {
            window.location.href = response.data.checkoutUrl;
          } else if (response.data?.requiresPayment) {
            proceedToPayment();
          } else {
            completeRegistrationSuccess();
          }
        },
        onError: (error) => {
          console.error("Registration failed:", error);
        },
      }
    );
  }

  return {
    tournament,
    step,
    form,
    divisions,
    isDivisionsPending,
    isRegistering: registerMutation.isPending,
    onRegistrationSubmit,
    completePayment,
    completeRegistrationSuccess,
    entryFee,
    appliedCoupon,
    applyCoupon: setAppliedCoupon,
    clearCoupon: () => setAppliedCoupon(null),
  };
}
