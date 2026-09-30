import { createContext } from 'react';
import type { Account } from '../types/tmdb';

export interface AuthContextValue {
  user: Account | null;
  isAuthenticated: boolean;
  /** Browsing without a TMDb account (no session) */
  isGuest: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
}

/** Holds the logged-in user and auth actions. Provided by <AuthProvider>, read with useAuth(). */
export const AuthContext = createContext<AuthContextValue | null>(null);
