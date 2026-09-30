import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../hooks/useMovies';

/** Movies the user saved, stored locally in the browser. */
function Favorites() {
  const { favorites } = useMovies();

  return (
    <Box component="section">
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FavoriteIcon color="primary" /> My favorites
        {favorites.length > 0 && (
          <Typography component="span" color="text.secondary">
            ({favorites.length})
          </Typography>
        )}
      </Typography>

      {favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <FavoriteBorderIcon sx={{ fontSize: 64, mb: 1 }} />
          <Typography variant="h6" gutterBottom>
            No favorites yet
          </Typography>
          <Typography sx={{ mb: 3 }}>Tap the heart on any movie to save it here.</Typography>
          <Button component={RouterLink} to="/" variant="contained">
            Browse movies
          </Button>
        </Box>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </Box>
  );
}

export default Favorites;
