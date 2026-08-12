"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
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
        // z.coerce.string() converts any value (including numbers from type="number" inputs)
        // to a string before validating. Plain z.string() would reject numeric values.
        fieldSchema = z.coerce.string().min(
          minLen,
          minLen > 1
            ? `${field.fieldName} must be at least ${minLen} characters`
            : `${field.fieldName} is required`
        );
      } else {
        fieldSchema = z.coerce.string().optional();
      }
      
      schemaShape[field._id] = fieldSchema;
    }
    return z.object(schemaShape);
  }, [fields]);

  // Keep schema ref synchronously in sync so the resolver wrapper always
  // uses the latest schema on every validation call.
  const schemaRef = useRef(dynamicSchema);
  schemaRef.current = dynamicSchema;

  const stableResolver = useCallback(
    (values: any, context: any, options: any) =>
      zodResolver(schemaRef.current)(values, context, options),
    []
  );

  const form = useForm<Record<string, any>>({
    resolver: stableResolver,
    defaultValues: {},
    mode: "onSubmit",
  });

  // Only reset form defaults ONCE when fields first arrive.
  // Without this guard, react-query background refetches (e.g. window focus)
  // cause `fields` to get a new array reference → useEffect re-fires →
  // form.reset() wipes all user-entered values back to "". The DOM inputs
  // still display the old values (uncontrolled via register()), so the user
  // sees filled inputs but the form's internal state is empty → validation
  // fails on every field.
  const hasInitializedRef = useRef(false);
  useEffect(() => {
    if (fields.length > 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
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
