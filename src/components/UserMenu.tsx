import { useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../hooks/useAuth';

/** Avatar button that opens a menu with the username and a logout option. */
function UserMenu() {
  const { user, logout } = useAuth();
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
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 16 }}>
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
            Signed in as <strong>{user.username}</strong>
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default UserMenu;
