import { Box, Card, Skeleton } from '@mui/material';
import MovieCard from './MovieCard';
import type { Movie } from '../types/tmdb';

interface MovieGridProps {
  movies: Movie[];
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

/** Grey placeholder with the same shape as a MovieCard. */
function MovieCardSkeleton() {
  return (
    <Card>
      <Skeleton variant="rectangular" sx={{ aspectRatio: '2 / 3', height: 'auto' }} />
      <Box sx={{ p: 1.5 }}>
        <Skeleton width="80%" />
        <Skeleton width="30%" />
      </Box>
    </Card>
  );
}

export default MovieGrid;
