import { createContext } from 'react';

export interface MovieContextValue {
  /** The user's last search query ("" when not searching). Persisted in localStorage. */
  lastSearch: string;
  setLastSearch: (query: string) => void;
}

/** Shared movie state for the app. Provided by <MovieProvider>, read with useMovies(). */
export const MovieContext = createContext<MovieContextValue | null>(null);
