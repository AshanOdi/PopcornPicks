import { Box, Typography } from '@mui/material';

interface LogoProps {
  /** Icon height in px; the text scales with it */
  size?: number;
}

/** Popcorn mascot + "PopcornPicks" title. Text (not an image) so it stays sharp and readable in both themes. */
function Logo({ size = 32 }: LogoProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box component="img" src="/popcorn_picks_icon_transparent.png" alt="" sx={{ height: size, width: 'auto' }} />
      <Typography component="span" noWrap sx={{ fontWeight: 800, fontSize: size * 0.6, letterSpacing: '-0.02em' }}>
        Popcorn<Box component="span" sx={{ color: 'primary.main' }}>Picks</Box>
      </Typography>
    </Box>
  );
}

export default Logo;
