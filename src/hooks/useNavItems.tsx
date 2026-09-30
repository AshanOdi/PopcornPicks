import type { ReactNode } from 'react';
import { Badge } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useMovies } from './useMovies';

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

/** Main navigation links, shared by the top Navbar (desktop) and BottomNav (mobile). */
export function useNavItems(): NavItem[] {
  const { favorites } = useMovies();

  return [
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
}
