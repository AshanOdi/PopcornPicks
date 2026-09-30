import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';
import type { MovieSummary } from '../types/tmdb';

interface MovieGridProps {
  movies: MovieSummary[];
  /** Roughly how many skeleton cards to show while loading (rounded up to complete rows) */
  loadingCount?: number;
  /**
   * More pages are coming. The grid then shows only complete rows and holds back
   * the leftover movies until the next page arrives, so there's never a half-empty row.
   */
  hasMore?: boolean;
}

/** Column count per breakpoint. Must match gridTemplateColumns below. */
function useColumnCount() {
  const theme = useTheme();
  // noSsr: read the real screen size on the first render (this app has no server rendering)
  const lg = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true });
  const md = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
  const sm = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
  return lg ? 6 : md ? 5 : sm ? 3 : 2;
}

/** Responsive poster grid (mobile-first): 2 / 3 / 5 / 6 columns, always complete rows. */
function MovieGrid({ movies, loadingCount = 0, hasMore = false }: MovieGridProps) {
  const columns = useColumnCount();

  // While more pages are coming, only show movies that fill complete rows
  const visibleCount = hasMore ? Math.floor(movies.length / columns) * columns : movies.length;
  const visible = movies.slice(0, visibleCount);

  // Round skeletons up so the loading rows are complete too
  const skeletonCount = loadingCount > 0 ? Math.ceil((visibleCount + loadingCount) / columns) * columns - visibleCount : 0;

  return (
    <Box
      sx={{
        display: 'grid',
        gap: { xs: 1.5, sm: 2, md: 2.5 },
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(5, 1fr)',
          lg: 'repeat(6, 1fr)',
        },
      }}
    >
      {visible.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}

      {Array.from({ length: skeletonCount }, (_, i) => (
        <MovieCardSkeleton key={`skeleton-${i}`} />
      ))}
    </Box>
  );
}

export default MovieGrid;
