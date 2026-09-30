import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '../hooks/useAuth';

/** Avatar button that opens a menu with the username and a logout option (or "Sign in" for guests). */
function UserMenu() {
  const { user, isGuest, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!user) return null;

  const displayName = user.name || user.username;

  async function handleLogout() {
    setAnchorEl(null);
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <>
      <Tooltip title="Account">
        <IconButton onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)} aria-label="account menu">
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'primary.contrastText', fontSize: 16, fontWeight: 700 }}>
            {displayName.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled sx={{ '&.Mui-disabled': { opacity: 1 } }}>
          <Typography variant="body2">
            {isGuest ? (
              <>
                Browsing as <strong>Guest</strong>
              </>
            ) : (
              <>
                Signed in as <strong>{user.username}</strong>
              </>
            )}
          </Typography>
        </MenuItem>
        <Divider />
        {/* Guests "sign in" by leaving guest mode and going to the login page */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>{isGuest ? <LoginIcon fontSize="small" /> : <LogoutIcon fontSize="small" />}</ListItemIcon>
          {isGuest ? 'Sign in' : 'Logout'}
        </MenuItem>
      </Menu>
    </>
  );
}

export default UserMenu;
