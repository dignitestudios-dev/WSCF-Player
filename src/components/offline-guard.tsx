"use client";

import { useEffect, useState } from "react";

function WifiOffIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF4D4F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-pulse"
    >
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.5" />
      <path d="M5 12.5a10.94 10.94 0 0 1 5.83-2.84" />
      <path d="M7.34 6.4a16.89 16.89 0 0 1 12.98 2.06" />
      <path d="M12 18.5h.01" />
    </svg>
  );
}

export default function OfflineGuard({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      {children}
      {isOffline && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="offline-dialog-title"
        >
          <div 
            className="flex w-full max-w-[420px] flex-col items-center rounded-2xl bg-white p-8 text-center shadow-2xl border border-zinc-100"
            style={{
              background: "linear-gradient(0deg, rgba(61, 55, 117, 0.05) 0%, rgba(61, 55, 117, 0) 100%), #FFFFFF"
            }}
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#FF4D4F]/10">
              <WifiOffIcon />
            </div>

            <h2 
              id="offline-dialog-title" 
              className="text-2xl font-bold tracking-tight text-zinc-900"
            >
              Connection Lost
            </h2>
            
            <p className="mt-3 text-base text-zinc-600 leading-relaxed">
              You are currently offline. Please check your internet connection. You cannot interact with the app until connection is restored.
            </p>

            <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-[#083F92]">
              <svg 
                className="animate-spin h-5 w-5 text-[#083F92]" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Waiting for connection...</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
