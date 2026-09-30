import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { MovieContext, type MovieContextValue } from './MovieContext';

const LAST_SEARCH_KEY = 'popcornpicks_last_search';

/** Provides shared movie state (last search) to the whole app. */
export function MovieProvider({ children }: { children: ReactNode }) {
  // Restore the last search after a refresh
  const [lastSearch, setLastSearchState] = useState(() => localStorage.getItem(LAST_SEARCH_KEY) ?? '');

  const setLastSearch = useCallback((query: string) => {
    if (query) localStorage.setItem(LAST_SEARCH_KEY, query);
    else localStorage.removeItem(LAST_SEARCH_KEY);
    setLastSearchState(query);
  }, []);

  const value = useMemo<MovieContextValue>(() => ({ lastSearch, setLastSearch }), [lastSearch, setLastSearch]);

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}
