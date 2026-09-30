import { AppBar, Box, Button, Container, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThemeToggle from './ThemeToggle';

/** Top navigation bar shown on every page. */
function Navbar() {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'inherit', textDecoration: 'none', flexGrow: 1 }}
          >
            <MovieFilterIcon color="primary" />
            <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
              Popcorn<Box component="span" sx={{ color: 'primary.main' }}>Picks</Box>
            </Typography>
          </Box>

          {/* Full "Favorites" button on larger screens, icon only on mobile */}
          <Button
            component={NavLink}
            to="/favorites"
            startIcon={<FavoriteIcon />}
            color="inherit"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, '&.active': { color: 'primary.main' } }}
          >
            Favorites
          </Button>
          <Tooltip title="Favorites">
            <IconButton
              component={NavLink}
              to="/favorites"
              color="inherit"
              aria-label="favorites"
              sx={{ display: { xs: 'inline-flex', sm: 'none' }, '&.active': { color: 'primary.main' } }}
            >
              <FavoriteIcon />
            </IconButton>
          </Tooltip>

          <ThemeToggle />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
