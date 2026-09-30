import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, Rating, Skeleton, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MovieIcon from '@mui/icons-material/Movie';
import CastList from '../components/CastList';
import TrailerButton from '../components/TrailerButton';
import FavoriteButton from '../components/FavoriteButton';
import ErrorAlert from '../components/ErrorAlert';
import { getErrorMessage, getMovieDetails, imageUrl } from '../api/tmdb';
import type { MovieDetails as MovieDetailsType } from '../types/tmdb';
import { formatRuntime } from '../utils/format';

/** Route wrapper: key={id} gives each movie a fresh component, so state resets when the id changes. */
function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Go back if we came from inside the app, otherwise go home (e.g. the link was opened directly)
  const goBack = () => (location.key === 'default' ? navigate('/') : navigate(-1));

  return (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={goBack} sx={{ mb: 2 }}>
        Back
      </Button>
      <MovieDetailsContent key={id} id={Number(id)} />
    </>
  );
}

function MovieDetailsContent({ id }: { id: number }) {
  const [movie, setMovie] = useState<MovieDetailsType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (Number.isNaN(id)) return; // invalid URL like /movie/abc: nothing to fetch
    let ignore = false;

    getMovieDetails(id)
      .then((data) => {
        if (!ignore) setMovie(data);
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err));
      });

    return () => {
      ignore = true;
    };
  }, [id, reloadKey]);

  if (Number.isNaN(id)) return <ErrorAlert message="This movie link is not valid." />;

  if (error) {
    return (
      <ErrorAlert
        message={error}
        onRetry={() => {
          setError(null);
          setReloadKey((key) => key + 1);
        }}
      />
    );
  }

  if (!movie) return <DetailsSkeleton />;

  const poster = imageUrl(movie.poster_path, 'w500');
  const backdrop = imageUrl(movie.backdrop_path, 'w1280');
  const year = movie.release_date?.slice(0, 4);

  return (
    <>
      {/* Hero: blurred backdrop behind poster + info. Dark overlay keeps white text readable in both themes. */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          color: '#fff',
          bgcolor: '#111',
          backgroundImage: backdrop ? `url(${backdrop})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.65))' }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 4 }}
          sx={{ position: 'relative', p: { xs: 2, sm: 4 }, alignItems: { xs: 'center', md: 'flex-start' } }}
        >
          {/* Poster */}
          <Box sx={{ flexShrink: 0, width: { xs: 200, md: 280 }, aspectRatio: '2 / 3', borderRadius: 2, overflow: 'hidden', boxShadow: 6, bgcolor: '#222' }}>
            {poster ? (
              <Box component="img" src={poster} alt={movie.title} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', color: 'grey.600' }}>
                <MovieIcon sx={{ fontSize: 64 }} />
              </Box>
            )}
          </Box>

          {/* Info */}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', sm: '2.25rem' } }}>
              {movie.title}
              {year && (
                <Box component="span" sx={{ fontWeight: 400, opacity: 0.7 }}>
                  {' '}
                  ({year})
                </Box>
              )}
            </Typography>

            {movie.tagline && (
              <Typography sx={{ fontStyle: 'italic', opacity: 0.75, mt: 0.5 }}>{movie.tagline}</Typography>
            )}

            {/* Meta: release date, runtime, rating */}
            <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center', mt: 2, opacity: 0.9 }}>
              {movie.release_date && (
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography variant="body2">{new Date(movie.release_date).toLocaleDateString()}</Typography>
                </Stack>
              )}
              {movie.runtime ? (
                <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body2">{formatRuntime(movie.runtime)}</Typography>
                </Stack>
              ) : null}
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Rating value={movie.vote_average / 2} precision={0.1} readOnly size="small" />
                <Typography variant="body2">
                  {movie.vote_average.toFixed(1)}/10 ({movie.vote_count.toLocaleString()} votes)
                </Typography>
              </Stack>
            </Stack>

            {/* Genres */}
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', mt: 2 }}>
              {movie.genres.map((genre) => (
                <Chip key={genre.id} label={genre.name} size="small" variant="outlined" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)' }} />
              ))}
            </Stack>

            <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
              Overview
            </Typography>
            <Typography sx={{ opacity: 0.9, lineHeight: 1.7 }}>{movie.overview || 'No overview available.'}</Typography>

            <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap', mt: 3 }}>
              <TrailerButton videos={movie.videos.results} title={movie.title} />
              <FavoriteButton movie={movie} variant="button" />
            </Stack>
          </Box>
        </Stack>
      </Box>

      <CastList cast={movie.credits.cast} />
    </>
  );
}

/** Placeholder with the same layout while details load. */
function DetailsSkeleton() {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} sx={{ alignItems: { xs: 'center', md: 'flex-start' } }}>
      <Skeleton variant="rounded" sx={{ width: { xs: 200, md: 280 }, height: 'auto', aspectRatio: '2 / 3', flexShrink: 0 }} />
      <Box sx={{ flex: 1, width: '100%' }}>
        <Skeleton variant="text" sx={{ fontSize: '2.5rem', width: '70%' }} />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
        <Skeleton variant="rounded" height={120} sx={{ mt: 3 }} />
      </Box>
    </Stack>
  );
}

export default MovieDetails;
