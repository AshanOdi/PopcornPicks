import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { MovieProvider } from './context/MovieProvider';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Discover from './pages/Discover';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <BrowserRouter>
          <Routes>
            {/* Login has no navbar */}
            <Route path="/login" element={<Login />} />

            {/* All other pages require login and share the Layout (navbar + container) */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MovieProvider>
    </AuthProvider>
  );
}

export default App;
