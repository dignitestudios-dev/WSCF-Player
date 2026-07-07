"use client";

import { useState } from "react";
import DeleteAccountConfirmModal from "@/features/dashboard/components/delete-account-confirm-modal";
import DeleteAccountPasswordModal from "@/features/dashboard/components/delete-account-password-modal";

type DeleteAccountStep = "confirm" | "password";

interface DeleteAccountFlowProps {
  onClose: () => void;
}

export default function DeleteAccountFlow({ onClose }: DeleteAccountFlowProps) {
  const [step, setStep] = useState<DeleteAccountStep>("confirm");

  function handleConfirm() {
    setStep("password");
  }

  if (step === "confirm") {
    return <DeleteAccountConfirmModal onClose={onClose} onConfirm={handleConfirm} />;
  }

  return <DeleteAccountPasswordModal onClose={onClose} />;
}
