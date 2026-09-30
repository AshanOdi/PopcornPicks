import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/** Shared page layout: navbar on top, the current page rendered in <Outlet />. */
function Layout() {
  return (
    <>
      <Navbar />
      <Container component="main" maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Outlet />
      </Container>
    </>
  );
}

export default Layout;
