import type { ReactNode } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoritesNavIcon from '../components/FavoritesNavIcon';

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

/** Main navigation links, shared by the top Navbar (desktop) and BottomNav (mobile). */
export function useNavItems(): NavItem[] {
  return [
    { to: '/', label: 'Home', icon: <HomeIcon /> },
    { to: '/discover', label: 'Discover', icon: <ExploreIcon /> },
    // Heart plays a short "+1" animation when a movie is added
    { to: '/favorites', label: 'Favorites', icon: <FavoritesNavIcon /> },
  ];
}
