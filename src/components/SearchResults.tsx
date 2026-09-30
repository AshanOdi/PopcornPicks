import { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import MovieGrid from './MovieGrid';
import ErrorAlert from './ErrorAlert';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { getErrorMessage, searchMovies } from '../api/tmdb';
import type { Movie } from '../types/tmdb';

/**
 * Search results with infinite scrolling.
 * Render with key={query} so the state resets automatically for every new search.
 */
function SearchResults({ query }: { query: string }) {
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

    searchMovies(query, page)
      .then((data) => {
        if (ignore) return;
        setMovies((prev) => {
          // TMDb pages can overlap, so skip movies we already have (avoids duplicate React keys)
          const seen = new Set(prev.map((m) => m.id));
          return [...prev, ...data.results.filter((m) => !seen.has(m.id))];
        });
        setTotalPages(data.total_pages);
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
  }, [query, page, reloadKey]);

  const loadNextPage = useCallback(() => {
    setLoading(true);
    setPage((p) => p + 1);
  }, []);

  const hasMore = page < totalPages;
  const sentinelRef = useInfiniteScroll(loadNextPage, hasMore && !loading && !error);

  function handleRetry() {
    setError(null);
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  const noResults = !loading && !error && movies.length === 0;

  return (
    <Box component="section">
      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
        Results for "{query}"
        {totalResults > 0 && (
          <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
            ({totalResults.toLocaleString()})
          </Typography>
        )}
      </Typography>

      {noResults ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <SearchOffIcon sx={{ fontSize: 56 }} />
          <Typography>No movies found. Try a different title.</Typography>
        </Box>
      ) : (
        <MovieGrid movies={movies} loadingCount={loading ? (page === 1 ? 12 : 6) : 0} />
      )}

      {error && <ErrorAlert message={error} onRetry={handleRetry} />}

      {/* Invisible marker: when it scrolls into view, the next page loads */}
      <Box ref={sentinelRef} sx={{ height: 1 }} />

      {!hasMore && movies.length > 0 && !loading && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          You've reached the end 🍿
        </Typography>
      )}
    </Box>
  );
}

export default SearchResults;
