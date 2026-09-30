import { Avatar, Box, Typography } from '@mui/material';
import { imageUrl } from '../api/tmdb';
import type { CastMember } from '../types/tmdb';

const MAX_CAST = 12;

/** Horizontally scrollable row of the top-billed cast. */
function CastList({ cast }: { cast: CastMember[] }) {
  if (cast.length === 0) return null;

  return (
    <Box component="section" sx={{ mt: 4 }}>
      <Typography variant="h6" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
        Top cast
      </Typography>

      <Box
        component="ul"
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          listStyle: 'none',
          p: 0,
          m: 0,
          pb: 1,
          scrollSnapType: 'x mandatory',
        }}
      >
        {cast.slice(0, MAX_CAST).map((person) => (
          <Box component="li" key={person.id} sx={{ flex: '0 0 100px', textAlign: 'center', scrollSnapAlign: 'start' }}>
            <Avatar
              src={imageUrl(person.profile_path, 'w185') ?? undefined}
              alt={person.name}
              sx={{ width: 80, height: 80, mx: 'auto', mb: 1 }}
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
        ))}
      </Box>
    </Box>
  );
}

export default CastList;
