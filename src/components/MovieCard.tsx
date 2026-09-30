import { Box, Card, CardActionArea, CardContent, Chip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import MovieIcon from '@mui/icons-material/Movie';
import FavoriteButton from './FavoriteButton';
import { imageUrl } from '../api/tmdb';
import type { MovieSummary } from '../types/tmdb';

/** Poster card showing title, release year and rating. Clicking opens the details page. */
function MovieCard({ movie }: { movie: MovieSummary }) {
  const poster = imageUrl(movie.poster_path, 'w342');
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Card sx={{ position: 'relative', height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <CardActionArea component={RouterLink} to={`/movie/${movie.id}`} sx={{ height: '100%' }}>
        {/* 2:3 poster ratio keeps every card the same size */}
        <Box sx={{ position: 'relative', aspectRatio: '2 / 3', bgcolor: 'action.hover' }}>
          {poster ? (
            <Box
              component="img"
              src={poster}
              alt={movie.title}
              loading="lazy"
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', color: 'text.disabled' }}>
              <MovieIcon sx={{ fontSize: 48 }} />
            </Box>
          )}

          <Chip
            icon={<StarIcon sx={{ '&&': { color: '#f5c518' } }} />}
            label={rating}
            size="small"
            sx={{
              position: 'absolute',
              top: 6,
              left: 6,
              height: 22,
              fontSize: 12,
              bgcolor: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              color: '#fff',
              '& .MuiChip-label': { px: 0.75 },
              '& .MuiChip-icon': { fontSize: 14 },
            }}
          />
        </Box>

        <CardContent sx={{ px: 1.25, py: 1, '&:last-child': { pb: 1 } }}>
          <Typography variant="body2" noWrap title={movie.title} sx={{ fontWeight: 700, lineHeight: 1.3 }}>
            {movie.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {year}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* Outside CardActionArea: a button can't be nested inside a link */}
      <Box sx={{ position: 'absolute', top: 6, right: 6 }}>
        <FavoriteButton movie={movie} />
      </Box>
    </Card>
  );
}

export default MovieCard;
