import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import ThemeToggle from '../components/ThemeToggle';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../api/tmdb';

/** Login with a TMDb username and password. */
function Login() {
  const { login, loginAsGuest, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Page the user tried to open before being sent to login (set by ProtectedRoute)
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  // Already logged in? Skip the login page.
  if (isAuthenticated) return <Navigate to={from} replace />;

  const usernameError = submitted && !username.trim();
  const passwordError = submitted && !password;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault(); // stop the browser from reloading the page
    setSubmitted(true);
    if (!username.trim() || !password) return;

    setLoading(true);
    setError(null);
    try {
      await login(username.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleGuest() {
    loginAsGuest();
    navigate(from, { replace: true });
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box sx={{ position: 'fixed', top: 12, right: 12 }}>
        <ThemeToggle />
      </Box>

      <Paper elevation={3} sx={{ width: '100%', maxWidth: 400, p: { xs: 3, sm: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box component="img" src="/popcorn_picks_icon_transparent.png" alt="" sx={{ height: 80, width: 'auto', mb: 1 }} />
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Popcorn<Box component="span" sx={{ color: 'primary.main' }}>Picks</Box>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in with your TMDb account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Labels stay above the fields (shrink: true). On mobile, browser autofill can otherwise
              desync MUI's floating label from the gap ("notch") it cuts in the border. */}
          <TextField
            label="Username"
            placeholder="Your TMDb username"
            slotProps={{ inputLabel: { shrink: true } }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={usernameError}
            helperText={usernameError ? 'Username is required' : ' '}
            autoComplete="username"
            autoFocus
            fullWidth
            margin="dense"
          />
          <TextField
            label="Password"
            placeholder="Your password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            helperText={passwordError ? 'Password is required' : ' '}
            autoComplete="current-password"
            fullWidth
            margin="dense"
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                      aria-label={showPassword ? 'hide password' : 'show password'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ mt: 1 }}>
            {loading ? <CircularProgress size={26} color="inherit" /> : 'Sign in'}
          </Button>
        </Box>

        <Divider sx={{ my: 2.5, color: 'text.secondary', typography: 'body2' }}>or</Divider>

        {/* Explore the app without an account (favorites and last search still work, stored in this browser) */}
        <Button variant="outlined" size="large" fullWidth startIcon={<PersonOutlineIcon />} onClick={handleGuest} disabled={loading}>
          Continue as guest
        </Button>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5, textAlign: 'center' }}>
          No account?{' '}
          <Link href="https://www.themoviedb.org/signup" target="_blank" rel="noopener">
            Sign up on TMDb
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
