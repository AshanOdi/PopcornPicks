import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Chip, Skeleton, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import TrailerButton from './TrailerButton';
import FavoriteButton from './FavoriteButton';
import { getMovieDetails, getTrendingMovies, imageUrl } from '../api/tmdb';
import type { MovieDetails } from '../types/tmdb';

const HERO_HEIGHT = { xs: 460, sm: 420, md: 480 };

/**
 * Large featured movie at the top of Home: the #1 trending movie that has a backdrop.
 * Decorative, so if it fails to load it simply hides (the rows below still work).
 */
function HeroBanner() {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let ignore = false;

    getTrendingMovies()
      .then((data) => {
        const featured = data.results.find((m) => m.backdrop_path) ?? data.results[0];
        if (!featured) throw new Error('No trending movies');
        // Details include genres, runtime and videos (for the trailer button)
        return getMovieDetails(featured.id);
      })
      .then((details) => {
        if (!ignore) setMovie(details);
      })
      .catch(() => {
        if (!ignore) setFailed(true);
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (failed) return null;
  if (!movie) return <Skeleton variant="rounded" sx={{ height: HERO_HEIGHT, borderRadius: 3 }} />;

  const backdrop = imageUrl(movie.backdrop_path, 'w1280');
  const year = movie.release_date?.slice(0, 4);
  const genres = movie.genres.slice(0, 3).map((g) => g.name).join(' • ');

  return (
    <Box
      component="section"
      aria-label="Featured movie"
      sx={{
        position: 'relative',
        height: HERO_HEIGHT,
        borderRadius: 3,
        overflow: 'hidden',
        color: '#fff',
        bgcolor: '#111',
        backgroundImage: backdrop ? `url(${backdrop})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {/* Gradient: from the bottom on phones (text sits low), from the left on desktop (text sits left) */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: {
            xs: 'linear-gradient(0deg, rgba(0,0,0,0.95) 25%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.1))',
            md: 'linear-gradient(90deg, rgba(0,0,0,0.92) 25%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.05))',
          },
        }}
      />

      <Box sx={{ position: 'relative', p: { xs: 2.5, sm: 4, md: 6 }, maxWidth: { md: '60%' } }}>
        <Chip
          icon={<WhatshotIcon />}
          label="#1 Trending this week"
          color="primary"
          size="small"
          sx={{ mb: 1.5, fontWeight: 600 }}
        />

        <Typography
          variant="h3"
          component="h2"
          sx={{ fontWeight: 800, lineHeight: 1.1, fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}
        >
          {movie.title}
        </Typography>

        {/* Meta: rating · year · genres */}
        <Stack
          direction="row"
          spacing={1.5}
          useFlexGap
          sx={{ flexWrap: 'wrap', alignItems: 'center', mt: 1.5, opacity: 0.9 }}
        >
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <StarIcon sx={{ color: '#f5c518', fontSize: 20 }} />
            <Typography sx={{ fontWeight: 600 }}>{movie.vote_average.toFixed(1)}</Typography>
          </Stack>
          {year && <Typography>{year}</Typography>}
          {genres && <Typography>{genres}</Typography>}
        </Stack>

        {/* Overview clamped to a few lines so the banner height stays fixed */}
        <Typography
          sx={{
            mt: 1.5,
            opacity: 0.85,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: { xs: 2, sm: 3 },
            overflow: 'hidden',
          }}
        >
          {movie.overview}
        </Typography>

        <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap', mt: 3 }}>
          <TrailerButton videos={movie.videos.results} title={movie.title} />
          <Button
            component={RouterLink}
            to={`/movie/${movie.id}`}
            variant="outlined"
            size="large"
            startIcon={<InfoOutlinedIcon />}
            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
          >
            Details
          </Button>
          <FavoriteButton movie={movie} variant="button" />
        </Stack>
      </Box>
    </Box>
  );
}

export default HeroBanner;
