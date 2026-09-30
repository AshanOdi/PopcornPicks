import { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import MovieGrid from './MovieGrid';
import ErrorAlert from './ErrorAlert';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { usePaginatedMovies } from '../hooks/usePaginatedMovies';
import { searchMovies } from '../api/tmdb';

/**
 * Search results with infinite scrolling.
 * Render with key={query} so the state resets automatically for every new search.
 */
function SearchResults({ query }: { query: string }) {
  const fetchPage = useCallback((page: number) => searchMovies(query, page), [query]);
  const { movies, page, totalResults, loading, error, hasMore, loadMore, retry } = usePaginatedMovies(fetchPage);

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading && !error);

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

      {error && <ErrorAlert message={error} onRetry={retry} />}

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
