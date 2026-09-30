import { useRef } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import ScrollArrow from './ScrollArrow';
import { scrollRow } from '../utils/scroll';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { imageUrl } from '../api/tmdb';
import type { CastMember } from '../types/tmdb';

const MAX_CAST = 12;
/** Below this many people there's nothing to scroll, so the row stays still. */
const MIN_CAST_TO_ANIMATE = 6;

function CastCard({ person, duplicate }: { person: CastMember; duplicate: boolean }) {
  return (
    <Box
      component="li"
      // The second copy is only there for the loop; hide it from screen readers
      aria-hidden={duplicate || undefined}
      sx={{
        flex: '0 0 auto',
        width: 100,
        // Spacing as margin (not flex gap) so both copies are exactly the same width -> seamless loop
        mr: 3,
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
 * Top-billed cast: slowly auto-scrolls in an endless loop, and can also be scrolled
 * manually (swipe, trackpad, ‹ › arrows). Hover pauses it and enlarges the avatar.
 */
function CastList({ cast }: { cast: CastMember[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const topCast = cast.slice(0, MAX_CAST);
  const animate = topCast.length >= MIN_CAST_TO_ANIMATE;
  useAutoScroll(scrollerRef, areaRef, animate);

  if (topCast.length === 0) return null;

  // Render the list twice for a seamless loop
  const items = animate ? [...topCast, ...topCast] : topCast;

  return (
    <Box component="section" sx={{ mt: 4 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
        Top cast
      </Typography>

      <Box ref={areaRef} sx={{ position: 'relative', '&:hover .row-arrow': { opacity: 1 } }}>
        {animate && <ScrollArrow direction="left" top="38%" onClick={() => scrollRow(scrollerRef.current, 'left')} />}

        <Box
          ref={scrollerRef}
          sx={{
            overflowX: 'auto',
            py: 1.5, // room for the enlarged avatar
            // Hide the scrollbar (still scrollable by swipe, trackpad and arrows)
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            // Fade the left/right edges so people glide in and out
            maskImage: animate ? 'linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent)' : undefined,
          }}
        >
          <Box component="ul" sx={{ display: 'flex', width: 'max-content', listStyle: 'none', p: 0, m: 0 }}>
            {items.map((person, i) => (
              <CastCard key={`${person.id}-${i}`} person={person} duplicate={i >= topCast.length} />
            ))}
          </Box>
        </Box>

        {animate && <ScrollArrow direction="right" top="38%" onClick={() => scrollRow(scrollerRef.current, 'right')} />}
      </Box>
    </Box>
  );
}

export default CastList;
