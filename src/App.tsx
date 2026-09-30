import { Box, Typography } from '@mui/material';
import ThemeToggle from './components/ThemeToggle';

// Temporary screen to try the theme toggle; replaced by routes in the next step
function App() {
  return (
    <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="h4" color="primary">
        PopcornPicks
      </Typography>
      <ThemeToggle />
    </Box>
  );
}

export default App;
