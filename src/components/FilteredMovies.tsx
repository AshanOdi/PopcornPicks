import { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import MovieGrid from './MovieGrid';
import ErrorAlert from './ErrorAlert';
import LoadMoreButton from './LoadMoreButton';
import { usePaginatedMovies } from '../hooks/usePaginatedMovies';
import { discoverMovies } from '../api/tmdb';
import type { MovieFilters } from '../types/tmdb';

/**
 * Movies matching the selected filters (TMDb discover endpoint), with Load More.
 * Render with a key based on the filters so the list resets when they change.
 */
function FilteredMovies({ filters }: { filters: MovieFilters }) {
  const fetchPage = useCallback((page: number) => discoverMovies(filters, page), [filters]);
  const { movies, page, totalResults, loading, error, hasMore, loadMore, retry } = usePaginatedMovies(fetchPage);

  const noResults = !loading && !error && movies.length === 0;

  return (
    <Box component="section">
      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TuneIcon color="primary" /> Filtered movies
        {totalResults > 0 && (
          <Typography component="span" color="text.secondary">
            ({totalResults.toLocaleString()})
          </Typography>
        )}
      </Typography>

      {noResults ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <SearchOffIcon sx={{ fontSize: 56 }} />
          <Typography>No movies match these filters.</Typography>
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

export default FilteredMovies;
