import { useCallback, useEffect, useState } from 'react';
import { getErrorMessage } from '../api/tmdb';
import type { Movie, PaginatedResponse } from '../types/tmdb';

/**
 * Loads a paginated TMDb list page by page and appends the results.
 * Used by search (infinite scroll), trending and filters (Load More).
 *
 * `fetchPage` must be stable (a module function or wrapped in useCallback).
 * To start over with new inputs, give the component using this hook a new `key`.
 */
export function usePaginatedMovies(fetchPage: (page: number) => Promise<PaginatedResponse<Movie>>) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Fetch the current page whenever `page` changes (or on retry)
  useEffect(() => {
    let ignore = false;

    fetchPage(page)
      .then((data) => {
        if (ignore) return;
        setMovies((prev) => {
          // TMDb pages can overlap, so skip movies we already have (avoids duplicate React keys)
          const seen = new Set(prev.map((m) => m.id));
          return [...prev, ...data.results.filter((m) => !seen.has(m.id))];
        });
        // TMDb never serves more than 500 pages
        setTotalPages(Math.min(data.total_pages, 500));
        setTotalResults(data.total_results);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [fetchPage, page, reloadKey]);

  const loadMore = useCallback(() => {
    setLoading(true);
    setPage((p) => p + 1);
  }, []);

  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  return {
    movies,
    page,
    totalResults,
    loading,
    error,
    hasMore: page < totalPages,
    loadMore,
    retry,
  };
}
