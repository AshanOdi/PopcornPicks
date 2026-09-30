import { Avatar, Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import { imageUrl } from '../api/tmdb';
import type { CastMember } from '../types/tmdb';

const MAX_CAST = 12;
/** Below this many people there's nothing to scroll, so the row stays still. */
const MIN_CAST_TO_ANIMATE = 6;
/** Seconds per cast member for one full loop (higher = slower). */
const SECONDS_PER_PERSON = 4;

/** Slides the doubled list left by half its width; the second copy then sits exactly where the first began. */
const marquee = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

function CastCard({ person, duplicate }: { person: CastMember; duplicate: boolean }) {
  return (
    <Box
      component="li"
      // The second copy is only there for the loop; hide it from screen readers
      aria-hidden={duplicate || undefined}
      data-duplicate={duplicate || undefined}
      sx={{
        flex: '0 0 auto',
        width: 100,
        // Spacing as padding (not flex gap) so both copies are exactly the same width -> seamless loop
        mr: 3,
        textAlign: 'center',
        cursor: 'default',
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

/** Top-billed cast as a slow, endless auto-scrolling row. Hover pauses it and enlarges the avatar. */
function CastList({ cast }: { cast: CastMember[] }) {
  const topCast = cast.slice(0, MAX_CAST);
  if (topCast.length === 0) return null;

  const animate = topCast.length >= MIN_CAST_TO_ANIMATE;
  // Render the list twice for a seamless loop
  const items = animate ? [...topCast, ...topCast] : topCast;

  return (
    <Box component="section" sx={{ mt: 4 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 1 }}>
        Top cast
      </Typography>

      <Box
        sx={{
          overflow: 'hidden',
          py: 1.5, // room for the enlarged avatar
          // Fade the left/right edges so people glide in and out
          maskImage: animate ? 'linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)' : undefined,
          // Users who prefer less motion get a normal, manually scrollable row
          '@media (prefers-reduced-motion: reduce)': {
            overflowX: 'auto',
            maskImage: 'none',
            '& [data-duplicate]': { display: 'none' },
          },
        }}
      >
        <Box
          component="ul"
          sx={{
            display: 'flex',
            width: 'max-content',
            listStyle: 'none',
            p: 0,
            m: 0,
            animation: animate ? `${marquee} ${topCast.length * SECONDS_PER_PERSON}s linear infinite` : 'none',
            '&:hover': { animationPlayState: 'paused' },
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          {items.map((person, i) => (
            <CastCard key={`${person.id}-${i}`} person={person} duplicate={i >= topCast.length} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default CastList;
