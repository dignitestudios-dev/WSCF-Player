"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
        // Use plain z.string() — transform+pipe is unreliable with @hookform/resolvers v5
        fieldSchema = z.string().min(
          minLen,
          minLen > 1
            ? `${field.fieldName} must be at least ${minLen} characters`
            : `${field.fieldName} is required`
        );
      } else {
        fieldSchema = z.string().optional();
      }
      
      schemaShape[field._id] = fieldSchema;
    }
    return z.object(schemaShape);
  }, [fields]);

  // Update ref synchronously during render (not only inside a useEffect).
  // This guarantees the resolver wrapper always reads the latest schema on
  // every call — even on the very first validation attempt after fields load.
  const schemaRef = useRef(dynamicSchema);
  schemaRef.current = dynamicSchema;

  const form = useForm<Record<string, any>>({
    // Stable resolver wrapper — reads schemaRef.current at call time so it
    // always uses the current schema regardless of when useForm was initialised.
    resolver: (values, context, options) =>
      zodResolver(schemaRef.current)(values, context, options),
    defaultValues: {},
    // "onSubmit" mode: errors only appear after the user clicks Submit.
    // "onChange" combined with a dynamically-built schema causes errors to
    // get stuck because the resolver runs on every keystroke before the
    // schema has finished settling.
    mode: "onSubmit",
  });

  // When fields load, reset the form so every field starts with an empty string.
  // Without this, inputs initialise as undefined which confuses z.string().
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
      name: field.fieldName,
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
