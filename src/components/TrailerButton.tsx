import { useState } from 'react';
import { Box, Button, Dialog, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import type { Video } from '../types/tmdb';

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

/** "Watch trailer" button that plays the YouTube trailer in a dialog. Renders nothing if there is no trailer. */
function TrailerButton({ videos, title }: { videos: Video[]; title: string }) {
  const [open, setOpen] = useState(false);
  const trailer = pickTrailer(videos);

  if (!trailer) return null;

  return (
    <>
      <Button variant="contained" size="large" startIcon={<PlayArrowIcon />} onClick={() => setOpen(true)}>
        Watch trailer
      </Button>

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
