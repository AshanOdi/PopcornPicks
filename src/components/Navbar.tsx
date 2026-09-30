import type { ReactNode } from 'react';
import { AppBar, Badge, Box, Button, Container, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { useMovies } from '../hooks/useMovies';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

/** Highlights the link for the current page (NavLink adds the "active" class). */
const activeStyle = { '&.active': { color: 'primary.main' } };

/** Top navigation bar shown on every page. */
function Navbar() {
  const { favorites } = useMovies();

  const navItems: NavItem[] = [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/discover', label: 'Discover', icon: <ExploreIcon /> },
    {
      to: '/favorites',
      label: 'Favorites',
      // Heart icon with the number of saved movies
      icon: (
        <Badge badgeContent={favorites.length} color="primary" max={99}>
          <FavoriteIcon />
        </Badge>
      ),
    },
  ];

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

          {/* Text buttons on larger screens, icons only on phones. `end` stops "/" matching every page. */}
          {navItems.map((item) => (
            <Box key={item.to}>
              <Button
                component={NavLink}
                to={item.to}
                end
                startIcon={item.icon}
                color="inherit"
                sx={{ display: { xs: 'none', md: 'inline-flex' }, ...activeStyle }}
              >
                {item.label}
              </Button>
              <Tooltip title={item.label}>
                <IconButton
                  component={NavLink}
                  to={item.to}
                  end
                  color="inherit"
                  aria-label={item.label}
                  sx={{ display: { xs: 'inline-flex', md: 'none' }, ...activeStyle }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            </Box>
          ))}

          <ThemeToggle />
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
