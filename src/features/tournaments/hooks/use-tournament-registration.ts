"use client";

import { useState, useMemo, useRef, useCallback } from "react";
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
  const divisions = data?.data?.divisions || [];

  const registerMutation = useTournamentRegistrationMutation(tournament.id);

  // Keep fields in a ref so the resolver always reads the latest field
  // definitions without needing to be re-created on every render.
  const fieldsRef = useRef<FormFieldApiData[]>([]);
  fieldsRef.current = fields;

  // Custom resolver — validates directly against field definitions.
  const resolver = useCallback(
    (values: Record<string, any>) => {
      const currentFields = fieldsRef.current;
      const errors: Record<string, { type: string; message: string }> = {};
      const parsed: Record<string, any> = {};

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
    [divisions] // stable — reads fieldsRef.current at call time
  );

  // Build reactive default values from the loaded fields.
  // Returns {} when fields haven't loaded yet, and { fieldId: "" } once loaded.
  const formValues = useMemo(() => {
    if (fields.length === 0) return undefined;
    const vals: Record<string, string> = {};
    for (const f of fields) {
      vals[f._id] = "";
    }
    if (divisions && divisions.length > 0) {
      vals["divisionId"] = "";
    }
    return vals;
  }, [fields, divisions]);

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
    const registrationData = fields.map((field) => ({
      name: field.fieldName,
      value:
        formData[field._id] !== undefined ? String(formData[field._id]) : "",
    }));
    
    const divisionId = formData["divisionId"];

    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";

    const requiresPayment =
      tournament.price !== "Free" && tournament.price !== "$0.00";

    registerMutation.mutate(
      {
        registrationData,
        divisionId,
        ...(requiresPayment
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
    divisions,
    isFieldsPending,
    isRegistering: registerMutation.isPending,
    onRegistrationSubmit,
    completePayment,
    completeRegistrationSuccess,
  };
}
