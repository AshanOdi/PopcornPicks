import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import MovieGrid from './MovieGrid';
import ErrorAlert from './ErrorAlert';
import LoadMoreButton from './LoadMoreButton';
import { usePaginatedMovies } from '../hooks/usePaginatedMovies';
import type { Movie, PaginatedResponse } from '../types/tmdb';

interface PaginatedMovieGridProps {
  title: string;
  icon?: ReactNode;
  /** Must be stable (module function or useCallback) */
  fetchPage: (page: number) => Promise<PaginatedResponse<Movie>>;
  emptyMessage?: string;
}

/**
 * A titled movie grid for any paginated TMDb list, with a Load More button.
 * Give it a new `key` to reset it when the list or filters change.
 */
function PaginatedMovieGrid({ title, icon, fetchPage, emptyMessage = 'No movies found.' }: PaginatedMovieGridProps) {
  const { movies, page, totalResults, loading, error, hasMore, loadMore, retry } = usePaginatedMovies(fetchPage);

  const noResults = !loading && !error && movies.length === 0;

  return (
    <Box component="section">
      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        {icon} {title}
        {totalResults > 0 && (
          <Typography component="span" color="text.secondary">
            ({totalResults.toLocaleString()})
          </Typography>
        )}
      </Typography>

      {noResults ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <SearchOffIcon sx={{ fontSize: 56 }} />
          <Typography>{emptyMessage}</Typography>
        </Box>
      ) : (
        <MovieGrid movies={movies} loadingCount={loading && page === 1 ? 12 : 0} />
      )}

      {error ? (
        <ErrorAlert message={error} onRetry={retry} />
      ) : (
        <LoadMoreButton hasMore={hasMore} loading={loading} onClick={loadMore} />
      )}
    </Box>
  );
}

export default PaginatedMovieGrid;
