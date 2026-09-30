import { useRef } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import ScrollArrow from './ScrollArrow';
import { scrollRow } from '../utils/scroll';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { imageUrl } from '../api/tmdb';
import type { CastMember } from '../types/tmdb';

const MAX_CAST = 12;
/**
 * Width of the soft fade at each edge. The row has the same padding at both ends,
 * so the first and last person are fully visible when the row is at the start/end.
 */
const EDGE_FADE_PX = 48;

function CastCard({ person }: { person: CastMember }) {
  return (
    <Box
      component="li"
      sx={{
        flex: '0 0 auto',
        width: 100,
        textAlign: 'center',
        '&:hover .cast-avatar': {
          transform: 'scale(1.15)',
          boxShadow: '0 0 0 3px var(--mui-palette-primary-main), 0 8px 20px rgba(0,0,0,0.35)',
        },
      }}
    >
      <Avatar
        className="cast-avatar"
        src={imageUrl(person.profile_path, 'w185') ?? undefined}
        alt={person.name}
        sx={{ width: 80, height: 80, mx: 'auto', mb: 1, transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
      >
        {person.name.charAt(0)}
      </Avatar>
      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
        {person.name}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2, display: 'block' }}>
        {person.character}
      </Typography>
    </Box>
  );
}

/**
 * Top-billed cast: slowly scrolls back and forth on its own, and can be scrolled manually
 * (swipe, trackpad, ‹ › arrows). Hover pauses it and enlarges the avatar.
 */
function CastList({ cast }: { cast: CastMember[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const topCast = cast.slice(0, MAX_CAST);
  // Only moves when the row is wider than the screen (the hook checks this)
  useAutoScroll(scrollerRef, areaRef, topCast.length > 0);

  if (topCast.length === 0) return null;

  return (
    <Box component="section" sx={{ mt: 4 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
        Top cast
      </Typography>

      <Box ref={areaRef} sx={{ position: 'relative', '&:hover .row-arrow': { opacity: 1 } }}>
        <ScrollArrow direction="left" top="38%" onClick={() => scrollRow(scrollerRef.current, 'left')} />

        <Box
          ref={scrollerRef}
          sx={{
            overflowX: 'auto',
            py: 1.5, // room for the enlarged avatar
            // Hide the scrollbar (still scrollable by swipe, trackpad and arrows)
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            // Soft fade at both edges so people glide in and out
            maskImage: `linear-gradient(90deg, transparent, #000 ${EDGE_FADE_PX}px, #000 calc(100% - ${EDGE_FADE_PX}px), transparent)`,
          }}
        >
          <Box
            component="ul"
            sx={{
              display: 'flex',
              gap: 3,
              width: 'max-content',
              listStyle: 'none',
              m: 0,
              py: 0,
              // Padding = fade width, so at the start/end nobody sits inside the fade
              px: `${EDGE_FADE_PX}px`,
            }}
          >
            {topCast.map((person) => (
              <CastCard key={person.id} person={person} />
            ))}
          </Box>
        </Box>

        <ScrollArrow direction="right" top="38%" onClick={() => scrollRow(scrollerRef.current, 'right')} />
      </Box>
    </Box>
  );
}

export default CastList;
