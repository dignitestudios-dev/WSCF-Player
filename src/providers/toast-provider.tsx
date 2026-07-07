"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ToastContainer,
  type ToastItem,
  type ToastType,
} from "@/components/ui/toast";

const TOAST_DURATION_MS = 4000;

interface ToastContextValue {
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let showSuccessToastExternal: ((message: string) => void) | null = null;
let showErrorToastExternal: ((message: string) => void) | null = null;

export function showSuccessToast(message: string) {
  showSuccessToastExternal?.(message);
}

export function showErrorToast(message: string) {
  showErrorToastExternal?.(message);
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const trimmedMessage = message.trim();
      if (!trimmedMessage) return;

      const id = crypto.randomUUID();

      setToasts((current) => [...current, { id, type, message: trimmedMessage }]);
      window.setTimeout(() => removeToast(id), TOAST_DURATION_MS);
    },
    [removeToast]
  );

  const showSuccessToastHandler = useCallback(
    (message: string) => addToast("success", message),
    [addToast]
  );

  const showErrorToastHandler = useCallback(
    (message: string) => addToast("error", message),
    [addToast]
  );

  useEffect(() => {
    showSuccessToastExternal = showSuccessToastHandler;
    showErrorToastExternal = showErrorToastHandler;

    return () => {
      showSuccessToastExternal = null;
      showErrorToastExternal = null;
    };
  }, [showSuccessToastHandler, showErrorToastHandler]);

  const value = useMemo(
    () => ({
      showSuccessToast: showSuccessToastHandler,
      showErrorToast: showErrorToastHandler,
    }),
    [showSuccessToastHandler, showErrorToastHandler]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}
