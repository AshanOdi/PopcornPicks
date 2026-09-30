import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import MovieGrid from './MovieGrid';
import ErrorAlert from './ErrorAlert';
import { getErrorMessage, getTrendingMovies } from '../api/tmdb';
import type { Movie } from '../types/tmdb';

/** "Trending this week" section, loaded from TMDb. */
function TrendingMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Changing this number re-runs the effect below (used by "Try again")
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // Ignore the response if the component unmounted or the effect re-ran before it arrived
    let ignore = false;

    getTrendingMovies()
      .then((data) => {
        if (!ignore) setMovies(data.results);
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
  }, [reloadKey]);

  function handleRetry() {
    setError(null);
    setLoading(true);
    setReloadKey((key) => key + 1);
  }

  return (
    <Box component="section">
      <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <WhatshotIcon color="primary" /> Trending this week
      </Typography>

      {error ? (
        <ErrorAlert message={error} onRetry={handleRetry} />
      ) : (
        <MovieGrid movies={movies} loadingCount={loading ? 12 : 0} />
      )}
    </Box>
  );
}

export default TrendingMovies;
