import { useRef, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';
import ErrorAlert from './ErrorAlert';
import ScrollArrow from './ScrollArrow';
import { scrollRow } from '../utils/scroll';
import { usePaginatedMovies } from '../hooks/usePaginatedMovies';
import type { Movie, PaginatedResponse } from '../types/tmdb';

interface MovieRowProps {
  title: string;
  icon?: ReactNode;
  /** Must be stable (module function or useCallback). Only the first page is shown. */
  fetchPage: (page: number) => Promise<PaginatedResponse<Movie>>;
  /** Where "See all" goes, e.g. /discover?list=top_rated */
  seeAllTo: string;
}

/** Card width per breakpoint; skeletons use the same size so nothing jumps when data arrives. */
const CARD_WIDTH = { xs: 130, sm: 150, md: 170 };

/** Horizontally scrollable row of movies with a "See all" link (swipe on mobile, arrows on desktop). */
function MovieRow({ title, icon, fetchPage, seeAllTo }: MovieRowProps) {
  const { movies, loading, error, retry } = usePaginatedMovies(fetchPage);
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <Box component="section">
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon} {title}
        </Typography>
        <Button component={RouterLink} to={seeAllTo} endIcon={<ArrowForwardIcon />} size="small">
          See all
        </Button>
      </Stack>

      {error ? (
        <ErrorAlert message={error} onRetry={retry} />
      ) : (
        <Box sx={{ position: 'relative', '&:hover .row-arrow': { opacity: 1 } }}>
          <ScrollArrow direction="left" onClick={() => scrollRow(scrollerRef.current, 'left')} />

          <Box
            ref={scrollerRef}
            sx={{
              display: 'flex',
              gap: { xs: 1.5, sm: 2 },
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              // A scroll container clips everything outside it, including the card's hover lift + shadow.
              // Padding gives the shadow room; the matching negative margin keeps the row in the same place.
              py: 2,
              my: -2,
              px: 1,
              mx: -1,
              scrollPaddingInline: 8, // snap cards to the padded edge, not the clipped one
              // Hide the scrollbar (still scrollable by swipe, trackpad and arrows)
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {(loading ? Array.from({ length: 8 }, () => null) : movies).map((movie, i) => (
              <Box key={movie?.id ?? `skeleton-${i}`} sx={{ flex: '0 0 auto', width: CARD_WIDTH, scrollSnapAlign: 'start' }}>
                {movie ? <MovieCard movie={movie} /> : <MovieCardSkeleton />}
              </Box>
            ))}
          </Box>

          <ScrollArrow direction="right" onClick={() => scrollRow(scrollerRef.current, 'right')} />
        </Box>
      )}
    </Box>
  );
}

export default MovieRow;
