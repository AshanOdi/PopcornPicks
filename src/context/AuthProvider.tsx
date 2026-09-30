import { useCallback, useMemo, useState, type ReactNode } from 'react';
import * as api from '../api/tmdb';
import type { Account } from '../types/tmdb';
import { AuthContext, type AuthContextValue } from './AuthContext';

const STORAGE_KEY = 'popcornpicks_auth';

interface StoredAuth {
  sessionId: string;
  account: Account;
}

/** Reads a saved session from localStorage (returns null if missing or corrupted). */
function loadStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

/** Provides the logged-in user and login/logout actions to the whole app. */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initial state: read localStorage once, so the user stays logged in after a refresh
  const [auth, setAuth] = useState<StoredAuth | null>(loadStoredAuth);

  const login = useCallback(async (username: string, password: string) => {
    const sessionId = await api.login(username, password);
    const account = await api.getAccount(sessionId);
    const next = { sessionId, account };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuth(next);
  }, []);

  const logout = useCallback(async () => {
    if (auth) {
      // Best effort: log out locally even if the API call fails
      await api.logout(auth.sessionId).catch(() => undefined);
    }
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, [auth]);

  // useMemo keeps the same object between renders, so consumers only re-render when auth changes
  const value = useMemo<AuthContextValue>(
    () => ({ user: auth?.account ?? null, isAuthenticated: auth !== null, login, logout }),
    [auth, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
