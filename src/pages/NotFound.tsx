import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/** Shown for any URL that doesn't match a route. */
function NotFound() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h2" gutterBottom>
        404
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        This page doesn't exist.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Back to home
      </Button>
    </Box>
  );
}

export default NotFound;
