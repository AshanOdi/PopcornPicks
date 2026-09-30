import { createContext } from 'react';
import type { MovieSummary } from '../types/tmdb';

export interface MovieContextValue {
  /** The user's last search query ("" when not searching). Persisted in localStorage. */
  lastSearch: string;
  setLastSearch: (query: string) => void;

  /** Movies the user saved, newest first. Persisted in localStorage. */
  favorites: MovieSummary[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (movie: MovieSummary) => void;
}

/** Shared movie state for the app. Provided by <MovieProvider>, read with useMovies(). */
export const MovieContext = createContext<MovieContextValue | null>(null);
