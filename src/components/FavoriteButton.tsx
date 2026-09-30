import type { MouseEvent } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useMovies } from '../hooks/useMovies';
import type { MovieSummary } from '../types/tmdb';

interface FavoriteButtonProps {
  movie: MovieSummary;
  /** "icon" for small heart on cards, "button" for a labeled button on the details page */
  variant?: 'icon' | 'button';
}

/** Adds or removes a movie from favorites. */
function FavoriteButton({ movie, variant = 'icon' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useMovies();
  const saved = isFavorite(movie.id);
  const label = saved ? 'Remove from favorites' : 'Add to favorites';

  function handleClick(event: MouseEvent) {
    // Don't trigger the card's link when the heart is clicked
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(movie);
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outlined"
        size="large"
        onClick={handleClick}
        startIcon={saved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        sx={{ color: saved ? 'primary.light' : '#fff', borderColor: 'rgba(255,255,255,0.5)' }}
      >
        {saved ? 'Favorited' : 'Add to favorites'}
      </Button>
    );
  }

  return (
    <Tooltip title={label}>
      <IconButton
        onClick={handleClick}
        aria-label={label}
        aria-pressed={saved}
        size="small"
        sx={{
          bgcolor: 'rgba(0,0,0,0.6)',
          color: saved ? 'primary.light' : '#fff',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
        }}
      >
        {saved ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}

export default FavoriteButton;
