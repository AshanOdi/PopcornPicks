import { Box } from '@mui/material';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';
import type { MovieSummary } from '../types/tmdb';

interface MovieGridProps {
  movies: MovieSummary[];
  /** Number of skeleton cards to show while loading */
  loadingCount?: number;
}

/**
 * Responsive poster grid (mobile-first):
 * 2 columns on phones, then as many ~170px columns as fit on larger screens.
 */
function MovieGrid({ movies, loadingCount = 0 }: MovieGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 1.5, sm: 2 },
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(auto-fill, minmax(170px, 1fr))',
        },
      }}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}

      {Array.from({ length: loadingCount }, (_, i) => (
        <MovieCardSkeleton key={`skeleton-${i}`} />
      ))}
    </Box>
  );
}

export default MovieGrid;
