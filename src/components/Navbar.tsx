import { AppBar, Box, Button, Container, Toolbar, useScrollTrigger } from '@mui/material';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { useNavItems } from '../hooks/useNavItems';

/**
 * Top bar shown on every page: logo, nav links (desktop only — phones use BottomNav),
 * theme toggle and user menu.
 *
 * At the top of the page it blends into the background. Once the user scrolls,
 * it turns into a floating "glass" pill: rounded, blurred, with a soft shadow.
 */
function Navbar() {
  const navItems = useNavItems();
  // true once the page is scrolled more than 16px (disableHysteresis: react in both directions immediately)
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 16 });

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{ top: 0, pt: scrolled ? { xs: 1, sm: 1.5 } : 0, transition: 'padding 0.3s ease', background: 'none' }}
    >
      {/* Outer + inner padding add up to the page gutters (16px / 24px), so the logo lines up with the content */}
      <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 1.5 } }}>
        <Box
          sx={{
            px: { xs: 1, sm: 1.5 },
            borderRadius: scrolled ? 999 : 0,
            border: 1,
            borderColor: scrolled ? 'divider' : 'transparent',
            // MUI CSS variable with the background color as "r g b", so we can add transparency
            backgroundColor: scrolled ? 'rgba(var(--mui-palette-background-paperChannel) / 0.7)' : 'transparent',
            backdropFilter: scrolled ? 'blur(16px) saturate(160%)' : 'none',
            boxShadow: scrolled ? '0 8px 32px rgba(0, 0, 0, 0.25)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: 56, sm: 60 } }}>
            <Box component={RouterLink} to="/" aria-label="PopcornPicks home" sx={{ color: 'inherit', textDecoration: 'none' }}>
              <Logo />
            </Box>

            {/* Empty spacer pushes the links to the right (kept separate so the gap isn't clickable) */}
            <Box sx={{ flexGrow: 1 }} />

            {/* `end` stops "/" from matching every page; NavLink adds the "active" class on the current page */}
            {navItems.map((item) => (
              <Button
                key={item.to}
                component={NavLink}
                to={item.to}
                end
                startIcon={item.icon}
                color="inherit"
                sx={{ display: { xs: 'none', md: 'inline-flex' }, '&.active': { color: 'primary.main', bgcolor: 'action.selected' } }}
              >
                {item.label}
              </Button>
            ))}

            <ThemeToggle />
            <UserMenu />
          </Toolbar>
        </Box>
      </Container>
    </AppBar>
  );
}

export default Navbar;
