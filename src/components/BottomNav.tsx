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
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        display: { xs: 'block', md: 'none' },
        pb: 'env(safe-area-inset-bottom)', // space for the iPhone home indicator
      }}
    >
      <BottomNavigation value={current} showLabels>
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
