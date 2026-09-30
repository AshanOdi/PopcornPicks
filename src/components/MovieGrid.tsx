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
 * Responsive poster grid (mobile-first): 2 / 4 / 5 columns.
 * TMDb always returns 20 movies per page, and 20 divides evenly by 2, 4 and 5,
 * so every loaded page fills complete rows (no half-empty last row).
 */
function MovieGrid({ movies, loadingCount = 0 }: MovieGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 1.5, sm: 2 },
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(4, 1fr)',
          md: 'repeat(5, 1fr)',
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
