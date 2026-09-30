import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

/** Shared page layout: navbar, the current page in <Outlet />, footer, and bottom nav on mobile. */
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Container component="main" maxWidth="lg" sx={{ pt: { xs: 2, sm: 4 } }}>
        <Outlet />
      </Container>
      <Footer />
      <BottomNav />
    </>
  );
}

export default Layout;
