import type { AuthUser } from './auth.types';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export function saveAuth(
  accessToken: string,
  user: AuthUser,
): void {
  localStorage.setItem(
    ACCESS_TOKEN_KEY,
    accessToken,
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user),
  );
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const userText = localStorage.getItem(USER_KEY);

  if (!userText) {
    return null;
  }

  try {
    return JSON.parse(userText) as AuthUser;
  } catch {
    clearAuth();
    return null;
  }
}

export function clearAuth(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}