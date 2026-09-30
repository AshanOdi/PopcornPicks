import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* defaultMode="system" uses the OS preference until the user picks a mode */}
    <ThemeProvider theme={theme} defaultMode="system">
      {/* CssBaseline resets browser styles and applies the theme background/text colors */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
