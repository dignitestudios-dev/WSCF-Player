"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import {
  useTournamentFormFieldsQuery,
  useTournamentRegistrationMutation,
} from "@/features/tournaments/api/tournaments.queries";

export function useTournamentRegistration(
  tournament: TournamentRegistrationTarget
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<TournamentRegistrationStep>("registration");

  const { data, isPending: isFieldsPending } = useTournamentFormFieldsQuery(
    tournament.id
  );
  const fields = data?.data?.fields || [];

  const registerMutation = useTournamentRegistrationMutation(tournament.id);

  // Keep fields in a ref so the resolver always reads the latest field
  // definitions without needing to be re-created on every render.
  const fieldsRef = useRef<FormFieldApiData[]>([]);
  fieldsRef.current = fields;

  // Custom resolver — validates directly against field definitions.
  // Replaces zodResolver which was silently failing with dynamic schemas
  // built from async API data in production.
  const resolver = useCallback(
    (values: Record<string, any>) => {
      const currentFields = fieldsRef.current;
      const errors: Record<string, { type: string; message: string }> = {};
      const parsed: Record<string, string> = {};

      for (const field of currentFields) {
        const raw = values[field._id];
        const str = raw != null ? String(raw).trim() : "";
        parsed[field._id] = str;

        if (field.nature === "mandatory") {
          const minLen = Number(field.minLength) || 1;
          if (str.length < minLen) {
            errors[field._id] = {
              type: "validation",
              message:
                minLen > 1
                  ? `${field.fieldName} must be at least ${minLen} characters`
                  : `${field.fieldName} is required`,
            };
          }
        }
      }

      return {
        values: Object.keys(errors).length > 0 ? {} : parsed,
        errors,
      };
    },
    [] // stable — reads from fieldsRef.current at call time
  );

  const form = useForm<Record<string, any>>({
    resolver,
    defaultValues: {},
    mode: "onChange",
  });

  // Initialise form defaults exactly once when fields first arrive.
  // Must not re-run on subsequent reference changes (react-query refetches)
  // because that would wipe user-entered values while the DOM inputs still
  // display them (uncontrolled via register()), causing phantom errors.
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (fields.length > 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      const defaults: Record<string, string> = {};
      for (const f of fields) {
        defaults[f._id] = "";
      }
      form.reset(defaults);
    }
  }, [fields, form]);

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
    const registrationData = fields.map((field) => ({
      name: field.fieldName,
      value:
        formData[field._id] !== undefined ? String(formData[field._id]) : "",
    }));

    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";

    const isPaid =
      tournament.price !== "Free" && tournament.price !== "$0.00";

    registerMutation.mutate(
      {
        registrationData,
        ...(isPaid
          ? {
              successUrl: `${baseUrl}/payment/success`,
              cancelUrl: `${baseUrl}/payment/cancel`,
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
    fields,
    isFieldsPending,
    isRegistering: registerMutation.isPending,
    onRegistrationSubmit,
    completePayment,
    completeRegistrationSuccess,
  };
}
