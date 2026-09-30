import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { useNavItems } from '../hooks/useNavItems';

/**
 * Top bar shown on every page: logo, nav links (desktop only — phones use BottomNav),
 * theme toggle and user menu.
 */
function Navbar() {
  const navItems = useNavItems();

  return (
    // "Glass" bar: semi-transparent background + blur, so content shows through softly while scrolling
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        // MUI CSS variable with the background color as "r g b", so we can add transparency
        backgroundColor: 'rgba(var(--mui-palette-background-defaultChannel) / 0.75)',
        backdropFilter: 'blur(12px)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          <Box component={RouterLink} to="/" aria-label="PopcornPicks home" sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
            <Logo />
          </Box>

          {/* `end` stops "/" from matching every page; NavLink adds the "active" class on the current page */}
          {navItems.map((item) => (
            <Button
              key={item.to}
              component={NavLink}
              to={item.to}
              end
              startIcon={item.icon}
              color="inherit"
              sx={{ display: { xs: 'none', md: 'inline-flex' }, '&.active': { color: 'primary.main' } }}
            >
              {item.label}
            </Button>
          ))}

          <ThemeToggle />
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
