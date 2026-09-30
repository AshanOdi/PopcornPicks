import { Link as RouterLink, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavItems } from '../hooks/useNavItems';

/** Fixed bottom navigation for phones and tablets (easy to reach with a thumb). Hidden on desktop. */
function BottomNav() {
  const navItems = useNavItems();
  const { pathname } = useLocation();

  // Highlight the current page; other pages (e.g. movie details) highlight nothing
  const current = navItems.some((item) => item.to === pathname) ? pathname : false;

  return (
    // Floating glass pill, matching the scrolled top Navbar
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        left: 12,
        right: 12,
        // Sit above the iPhone home indicator
        bottom: 'calc(12px + env(safe-area-inset-bottom))',
        zIndex: (theme) => theme.zIndex.appBar,
        display: { xs: 'block', md: 'none' },
        borderRadius: 999,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        backgroundColor: 'rgba(var(--mui-palette-background-paperChannel) / 0.75)',
        backdropFilter: 'blur(16px) saturate(160%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <BottomNavigation value={current} showLabels sx={{ bgcolor: 'transparent' }}>
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.to}
            component={RouterLink}
            to={item.to}
            value={item.to}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
