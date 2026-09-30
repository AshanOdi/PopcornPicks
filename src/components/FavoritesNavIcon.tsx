import { useState } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useMovies } from '../hooks/useMovies';

/** Heart grows, flashes red, and settles back. */
const pop = keyframes`
  0%   { transform: scale(1);   color: inherit; }
  30%  { transform: scale(1.4); color: var(--mui-palette-secondary-main); }
  100% { transform: scale(1);   color: inherit; }
`;

/** "+1" floats up and fades out. */
const floatUp = keyframes`
  0%   { opacity: 0; transform: translateY(4px); }
  20%  { opacity: 1; }
  100% { opacity: 0; transform: translateY(-16px); }
`;

/**
 * Heart icon for the Favorites nav link.
 * When a movie is added to favorites it plays a short "pop" with a "+1", then goes back to normal.
 */
function FavoritesNavIcon() {
  const { favorites } = useMovies();
  const count = favorites.length;

  // Detect "a favorite was added" by comparing with the previous count.
  // Updating state during render (instead of in an effect) is React's recommended way to react to prop/state changes.
  const [prevCount, setPrevCount] = useState(count);
  const [popId, setPopId] = useState(0);
  if (count !== prevCount) {
    setPrevCount(count);
    if (count > prevCount) setPopId((id) => id + 1);
  }

  return (
    <Box component="span" sx={{ position: 'relative', display: 'inline-flex' }}>
      {/* A new key restarts the CSS animation every time a favorite is added */}
      <FavoriteIcon key={popId} sx={popId ? { animation: `${pop} 0.6s ease` } : undefined} />

      {popId > 0 && (
        <Box
          key={`plus-${popId}`}
          component="span"
          aria-hidden
          sx={{
            position: 'absolute',
            top: -12,
            right: -14,
            fontSize: 12,
            fontWeight: 800,
            color: 'secondary.main',
            pointerEvents: 'none',
            opacity: 0,
            animation: `${floatUp} 1s ease forwards`,
          }}
        >
          +1
        </Box>
      )}
    </Box>
  );
}

export default FavoritesNavIcon;
