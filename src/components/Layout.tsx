import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

/** Shared page layout: navbar on top, the current page in <Outlet />, bottom nav on mobile. */
function Layout() {
  return (
    <>
      <Navbar />
      {/* Extra bottom padding on mobile so the fixed BottomNav doesn't cover content */}
      <Container component="main" maxWidth="lg" sx={{ pt: { xs: 2, sm: 4 }, pb: { xs: 10, md: 4 } }}>
        <Outlet />
      </Container>
      <BottomNav />
    </>
  );
}

export default Layout;
