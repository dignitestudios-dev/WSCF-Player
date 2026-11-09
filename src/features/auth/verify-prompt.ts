// The skippable "verify your email" step is shown once per account, right after
// the first payment. Remembered per account (not per browser) so a second
// family signing up on the same computer still sees it.
const keyFor = (accountId: string) => `wscf_verify_email_prompt_seen:${accountId}`;

export function hasSeenVerifyPrompt(accountId?: string | null) {
  if (!accountId) return false;
  try {
    return localStorage.getItem(keyFor(accountId)) === "1";
  } catch {
    return false;
  }
}

export function markVerifyPromptSeen(accountId?: string | null) {
  if (!accountId) return;
  try {
    localStorage.setItem(keyFor(accountId), "1");
  } catch {}
}

/** True when this account should be offered the verify step now. */
export function shouldShowVerifyPrompt(
  account?: { _id?: string; isEmailVerified?: boolean } | null,
) {
  return Boolean(account) && !account?.isEmailVerified && !hasSeenVerifyPrompt(account?._id);
}
