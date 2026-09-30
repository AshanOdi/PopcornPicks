import { Box, Typography } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import MovieGrid from './MovieGrid';
import ErrorAlert from './ErrorAlert';
import LoadMoreButton from './LoadMoreButton';
import { usePaginatedMovies } from '../hooks/usePaginatedMovies';
import { getTrendingMovies } from '../api/tmdb';

/** "Trending this week" section with a Load More button. */
function TrendingMovies() {
  // getTrendingMovies is a module-level function, so it's already stable
  const { movies, page, loading, error, hasMore, loadMore, retry } = usePaginatedMovies(getTrendingMovies);

  return (
    <Box component="section">
      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <WhatshotIcon color="primary" /> Trending this week
      </Typography>

      <MovieGrid movies={movies} loadingCount={loading && page === 1 ? 12 : 0} />

      {error ? (
        <ErrorAlert message={error} onRetry={retry} />
      ) : (
        <LoadMoreButton hasMore={hasMore} loading={loading} onClick={loadMore} />
      )}
    </Box>
  );
}

export default TrendingMovies;
