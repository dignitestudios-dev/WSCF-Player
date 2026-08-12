"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useTournamentFormFieldsQuery, useTournamentRegistrationMutation } from "@/features/tournaments/api/tournaments.queries";

export function useTournamentRegistration(tournament: TournamentRegistrationTarget) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<TournamentRegistrationStep>("registration");

  const { data, isPending: isFieldsPending } = useTournamentFormFieldsQuery(tournament.id);
  const fields = data?.data?.fields || [];
  
  const registerMutation = useTournamentRegistrationMutation(tournament.id);

  const dynamicSchema = useMemo(() => {
    const schemaShape: Record<string, any> = {};
    for (const field of fields) {
      let fieldSchema: z.ZodTypeAny;
      
      if (field.nature === "mandatory") {
        const minLen = Number(field.minLength) || 1;
        fieldSchema = z
          .any()
          .transform((v) => (v === undefined || v === null ? "" : String(v).trim()))
          .pipe(
            z.string().min(
              minLen,
              minLen > 1 ? `${field.fieldName} must be at least ${minLen} characters` : `${field.fieldName} is required`
            )
          );
      } else {
        fieldSchema = z
          .any()
          .transform((v) => (v === undefined || v === null ? "" : String(v).trim()))
          .pipe(z.string().optional().or(z.literal("")));
      }
      
      schemaShape[field._id] = fieldSchema;
    }
    return z.object(schemaShape);
  }, [fields]);

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {},
    mode: "onChange",
  });

  // Re-evaluate form when fields are loaded to set default values
  useEffect(() => {
    if (fields.length > 0) {
      const defaultValues: Record<string, any> = {};
      fields.forEach((f) => {
        defaultValues[f._id] = "";
      });
      form.reset(defaultValues);
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
      name: field.fieldName, // using fieldName as requested in the payload spec
      value: formData[field._id] !== undefined ? String(formData[field._id]) : "",
    }));

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    const isPaid = tournament.price !== "Free" && tournament.price !== "$0.00";

    registerMutation.mutate(
      { 
        registrationData,
        ...(isPaid ? {
          successUrl: `${baseUrl}/payment/success`,
          cancelUrl: `${baseUrl}/payment/cancel`,
        } : {}),
      },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
          queryClient.invalidateQueries({ queryKey: ["myTournaments"] });
          if (response.data?.requiresPayment && response.data?.checkoutUrl) {
            window.location.href = response.data.checkoutUrl;
          } else if (response.data?.requiresPayment) {
            proceedToPayment(); // fallback if no checkoutUrl provided
          } else {
            completeRegistrationSuccess();
          }
        },
        onError: (error) => {
          console.error("Registration failed:", error);
          // could show toast here
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
