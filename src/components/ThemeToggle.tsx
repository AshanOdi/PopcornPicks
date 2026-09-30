import { IconButton, Tooltip } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

/** Switches between light and dark mode. The choice is remembered by MUI in localStorage. */
function ThemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();

  // mode is undefined until MUI has read the saved preference
  if (!mode) return null;

  // "system" follows the OS setting, so resolve it to the actual light/dark value
  const currentMode = mode === 'system' ? systemMode : mode;
  const isDark = currentMode === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton color="inherit" onClick={() => setMode(isDark ? 'light' : 'dark')} aria-label="toggle theme">
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
