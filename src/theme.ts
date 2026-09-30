import { createTheme } from '@mui/material/styles';

/**
 * App theme with built-in light and dark color schemes.
 * MUI stores the user's choice in localStorage and switches CSS variables,
 * so every component updates without re-rendering the whole app.
 */
const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#d32f2f' }, // cinema red
        secondary: { main: '#f5a623' }, // popcorn yellow
        background: { default: '#f5f5f7', paper: '#ffffff' },
      },
    },
    dark: {
      palette: {
        primary: { main: '#ef5350' },
        secondary: { main: '#ffb74d' },
        background: { default: '#0f0f13', paper: '#1a1a22' },
      },
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
  },
});

export default theme;
