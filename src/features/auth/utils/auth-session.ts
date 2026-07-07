import type { AppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/auth.slice";
import {
  AUTH_TOKEN_KEY,
  AUTH_USER_KEY,
  TOKEN_MAX_AGE_SECONDS,
} from "@/utils/constants";

interface PersistAuthSessionOptions {
  user: User;
  accessToken: string;
  dispatch: AppDispatch;
  setCookie?: boolean;
}

export function persistAuthSession({
  user,
  accessToken,
  dispatch,
  setCookie = true,
}: PersistAuthSessionOptions) {
  localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

  if (setCookie) {
    document.cookie = `${AUTH_TOKEN_KEY}=${accessToken}; path=/; max-age=${TOKEN_MAX_AGE_SECONDS}`;
  }

  dispatch(setCredentials({ user, accessToken }));
}
