import { useState } from 'react';
import { Box, Button, Dialog, IconButton } from '@mui/material';
import { keyframes } from '@emotion/react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import type { Video } from '../types/tmdb';

/** Expanding, fading ring around the play circle. */
const pulse = keyframes`
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(1.5); opacity: 0; }
`;

/** Picks the best YouTube video: official trailer > any trailer > teaser > any YouTube video. */
function pickTrailer(videos: Video[]) {
  const youtube = videos.filter((v) => v.site === 'YouTube');
  return (
    youtube.find((v) => v.type === 'Trailer' && v.official) ??
    youtube.find((v) => v.type === 'Trailer') ??
    youtube.find((v) => v.type === 'Teaser') ??
    youtube[0]
  );
}

interface TrailerButtonProps {
  videos: Video[];
  title: string;
  /** "button" = labeled button, "circle" = large glass play circle (hero banner) */
  variant?: 'button' | 'circle';
}

/** Plays the YouTube trailer in a dialog. Renders nothing if there is no trailer. */
function TrailerButton({ videos, title, variant = 'button' }: TrailerButtonProps) {
  const [open, setOpen] = useState(false);
  const trailer = pickTrailer(videos);

  if (!trailer) return null;

  const trigger =
    variant === 'circle' ? (
      <IconButton
        onClick={() => setOpen(true)}
        aria-label={`Play ${title} trailer`}
        sx={{
          position: 'relative',
          width: 88,
          height: 88,
          color: '#fff',
          bgcolor: 'rgba(255,255,255,0.12)',
          border: '2px solid rgba(255,255,255,0.7)',
          backdropFilter: 'blur(8px)',
          transition: 'transform 0.2s, background-color 0.2s',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.25)', transform: 'scale(1.08)' },
          // Pulse ring
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: -2,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.6)',
            animation: `${pulse} 2s ease-out infinite`,
          },
        }}
      >
        <PlayArrowIcon sx={{ fontSize: 48 }} />
      </IconButton>
    ) : (
      <Button variant="contained" size="large" startIcon={<PlayArrowIcon />} onClick={() => setOpen(true)}>
        Watch trailer
      </Button>
    );

  return (
    <>
      {trigger}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <IconButton
          onClick={() => setOpen(false)}
          aria-label="close trailer"
          sx={{ position: 'absolute', top: 4, right: 4, zIndex: 1, color: '#fff', bgcolor: 'rgba(0,0,0,0.5)' }}
        >
          <CloseIcon />
        </IconButton>

        {/* The iframe only exists while the dialog is open, so the video stops when it closes */}
        <Box sx={{ aspectRatio: '16 / 9', bgcolor: '#000' }}>
          <Box
            component="iframe"
            src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0`}
            title={`${title} trailer`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            sx={{ width: '100%', height: '100%', border: 0, display: 'block' }}
          />
        </Box>
      </Dialog>
    </>
  );
}

export default TrailerButton;
