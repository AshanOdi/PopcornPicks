import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { MovieContext, type MovieContextValue } from './MovieContext';
import type { MovieSummary } from '../types/tmdb';

const LAST_SEARCH_KEY = 'popcornpicks_last_search';
const FAVORITES_KEY = 'popcornpicks_favorites';

/** Reads saved favorites from localStorage (empty list if missing or corrupted). */
function loadFavorites(): MovieSummary[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as MovieSummary[]) : [];
  } catch {
    return [];
  }
}

/** Provides shared movie state (last search, favorites) to the whole app. */
export function MovieProvider({ children }: { children: ReactNode }) {
  // Restore the last search after a refresh
  const [lastSearch, setLastSearchState] = useState(() => localStorage.getItem(LAST_SEARCH_KEY) ?? '');
  const [favorites, setFavorites] = useState<MovieSummary[]>(loadFavorites);

  // Save favorites whenever they change
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const setLastSearch = useCallback((query: string) => {
    if (query) localStorage.setItem(LAST_SEARCH_KEY, query);
    else localStorage.removeItem(LAST_SEARCH_KEY);
    setLastSearchState(query);
  }, []);

  const isFavorite = useCallback((id: number) => favorites.some((m) => m.id === id), [favorites]);

  const toggleFavorite = useCallback((movie: MovieSummary) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev.filter((m) => m.id !== movie.id);
      // Store only the fields a MovieCard needs, not the whole API object
      const { id, title, poster_path, release_date, vote_average } = movie;
      return [{ id, title, poster_path, release_date, vote_average }, ...prev];
    });
  }, []);

  const value = useMemo<MovieContextValue>(
    () => ({ lastSearch, setLastSearch, favorites, isFavorite, toggleFavorite }),
    [lastSearch, setLastSearch, favorites, isFavorite, toggleFavorite],
  );

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}
