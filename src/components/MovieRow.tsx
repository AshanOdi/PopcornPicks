import { useRef, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';
import ErrorAlert from './ErrorAlert';
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

/** Arrow button shown on the left/right edge of the row on desktop. */
function ScrollArrow({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  return (
    <IconButton
      onClick={onClick}
      aria-label={`scroll ${direction}`}
      className="row-arrow"
      sx={{
        position: 'absolute',
        top: '40%',
        [direction]: -8,
        transform: 'translateY(-50%)',
        zIndex: 1,
        display: { xs: 'none', md: 'flex' },
        opacity: 0, // revealed when the row is hovered
        transition: 'opacity 0.2s',
        bgcolor: 'background.paper',
        boxShadow: 3,
        '&:hover': { bgcolor: 'background.paper' },
      }}
    >
      {direction === 'left' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </IconButton>
  );
}

/** Horizontally scrollable row of movies with a "See all" link (swipe on mobile, arrows on desktop). */
function MovieRow({ title, icon, fetchPage, seeAllTo }: MovieRowProps) {
  const { movies, loading, error, retry } = usePaginatedMovies(fetchPage);
  const scrollerRef = useRef<HTMLDivElement>(null);

  /** Scrolls by ~80% of the visible width, so the next set of posters slides in. */
  function scroll(direction: 'left' | 'right') {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }

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
          <ScrollArrow direction="left" onClick={() => scroll('left')} />

          <Box
            ref={scrollerRef}
            sx={{
              display: 'flex',
              gap: { xs: 1.5, sm: 2 },
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              pb: 1,
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

          <ScrollArrow direction="right" onClick={() => scroll('right')} />
        </Box>
      )}
    </Box>
  );
}

export default MovieRow;
