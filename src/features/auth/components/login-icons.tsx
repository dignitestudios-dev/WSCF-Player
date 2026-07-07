function UserIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z"
        fill="white"
      />
      <path
        d="M12 14C8.13 14 2 15.79 2 19V20H22V19C22 15.79 15.87 14 12 14Z"
        fill="white"
      />
    </svg>
  );
}

function ChessIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C10.5 2 9.5 3.5 9.5 5C9.5 6 10 6.8 10.7 7.2L9.5 12H14.5L13.3 7.2C14 6.8 14.5 6 14.5 5C14.5 3.5 13.5 2 12 2ZM8 12H16V14C16 15.1 15.1 16 14 16H10C8.9 16 8 15.1 8 14V12Z"
        fill="white"
      />
      <path d="M7 16H17L18 20H6L7 16Z" fill="white" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" />
      <path d="M12.5 12.5L16 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 11C10.66 11 12 9.66 12 8C12 6.34 10.66 5 9 5C7.34 5 6 6.34 6 8C6 9.66 7.34 11 9 11ZM15 11C16.66 11 18 9.66 18 8C18 6.34 16.66 5 15 5C13.34 5 12 6.34 12 8C12 9.66 13.34 11 15 11ZM9 13C6.33 13 2 14.34 2 17V18H16V17C16 14.34 11.67 13 9 13ZM15 13C14.71 13 14.38 13.02 14.03 13.05C15.19 13.89 16 15.02 16 17V18H22V17C22 14.34 17.67 13 15 13Z"
        fill="white"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M16 11C17.66 11 19 9.66 19 8C19 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 11 9.66 11 8C11 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.33 13 1 14.34 1 17V18H15V17C15 14.34 10.67 13 8 13ZM16 13C15.29 13 14.63 13.11 14 13.29C15.24 14.17 16 15.34 16 17V18H23V17C23 14.34 19.67 13 16 13Z"
        fill="white"
      />
    </svg>
  );
}

export { UserIcon, ChessIcon, SearchIcon, TeamIcon, UsersIcon };
