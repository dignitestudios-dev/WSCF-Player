"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useTournamentFormFieldsQuery, useTournamentRegistrationMutation } from "@/features/tournaments/api/tournaments.queries";

export function useTournamentRegistration(tournament: TournamentRegistrationTarget) {
  const { user } = useAuth();
  const [step, setStep] = useState<TournamentRegistrationStep>("registration");

  const { data, isPending: isFieldsPending } = useTournamentFormFieldsQuery(tournament.id);
  const fields = data?.data?.fields || [];
  
  const registerMutation = useTournamentRegistrationMutation(tournament.id);

  const dynamicSchema = useMemo(() => {
    const schemaShape: Record<string, any> = {};
    for (const field of fields) {
      let fieldSchema = z.string({ required_error: `${field.fieldName} is required` });
      
      if (field.nature === "mandatory") {
        fieldSchema = fieldSchema.min(field.minLength || 1, `${field.fieldName} is required`);
      } else {
        fieldSchema = fieldSchema.optional().or(z.literal(""));
      }
      
      schemaShape[field._id] = fieldSchema;
    }
    return z.object(schemaShape);
  }, [fields]);

  const form = useForm<Record<string, any>>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: {},
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

  function onRegistrationSubmit(formData: Record<string, any>) {
    const registrationData = fields.map((field) => ({
      name: field.fieldName, // using fieldName as requested in the payload spec
      value: formData[field._id] || "",
    }));

    registerMutation.mutate(
      { registrationData },
      {
        onSuccess: (response) => {
          if (response.data?.requiresPayment) {
            proceedToPayment();
          } else {
            completePayment();
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
  };
}
