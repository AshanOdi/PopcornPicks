import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import Logo from './Logo';

const REPO_URL = 'https://github.com/AshanOdi/PopcornPicks';
// Computed once when the app loads (reading the clock during render is impure)
const CURRENT_YEAR = new Date().getFullYear();

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/discover', label: 'Discover' },
  { to: '/favorites', label: 'Favorites' },
];

/** Site footer: brand, quick links, TMDb attribution (required by TMDb's API terms) and credits. */
function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 4, md: 8 },
        borderTop: 1,
        borderColor: 'divider',
        // Extra bottom space on mobile so the floating BottomNav doesn't cover the footer
        pb: { xs: 13, md: 4 },
        pt: { xs: 4, md: 5 },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}
        >
          <Box>
            <Logo size={28} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Discover trending films, search any movie and save your favorites.
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
            {footerLinks.map((link) => (
              <Link key={link.to} component={RouterLink} to={link.to} color="text.secondary" underline="hover" variant="body2">
                {link.label}
              </Link>
            ))}
            <Link
              href={REPO_URL}
              target="_blank"
              rel="noopener"
              color="text.secondary"
              aria-label="Source code on GitHub"
              sx={{ display: 'inline-flex' }}
            >
              <GitHubIcon fontSize="small" />
            </Link>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ justifyContent: 'space-between', color: 'text.secondary' }}
        >
          <Typography variant="caption">
            This product uses the{' '}
            <Link href="https://www.themoviedb.org/" target="_blank" rel="noopener" color="inherit">
              TMDB API
            </Link>{' '}
            but is not endorsed or certified by TMDB.
          </Typography>
          <Typography variant="caption">
            © {CURRENT_YEAR} PopcornPicks · Built by Ashan Odithya
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;
