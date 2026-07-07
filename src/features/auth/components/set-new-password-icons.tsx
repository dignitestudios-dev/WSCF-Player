function SetNewPasswordIcon() {
  return (
    <svg width="70" height="70" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17 9H7V7C7 4.79 8.79 3 11 3H13C15.21 3 17 4.79 17 7V9Z"
        fill="#083F92"
      />
      <path
        d="M6 9H18C19.1 9 20 9.9 20 11V20C20 21.1 19.1 22 18 22H6C4.9 22 4 21.1 4 20V11C4 9.9 4.9 9 6 9Z"
        fill="#083F92"
      />
      <circle cx="12" cy="15.5" r="1.5" fill="white" />
      <rect x="11" y="15.5" width="2" height="3" rx="1" fill="white" />
    </svg>
  );
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
          stroke="rgba(24,24,24,0.32)"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="12" r="3" stroke="rgba(24,24,24,0.32)" strokeWidth="1.5" />
        <path d="M3 3L21 21" stroke="rgba(24,24,24,0.32)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
        stroke="rgba(24,24,24,0.32)"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3" stroke="rgba(24,24,24,0.32)" strokeWidth="1.5" />
    </svg>
  );
}

export { SetNewPasswordIcon, EyeIcon };
