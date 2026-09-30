import { useContext } from 'react';
import { MovieContext } from '../context/MovieContext';

/** Access shared movie state. Must be used inside <MovieProvider>. */
export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovies must be used inside <MovieProvider>');
  return context;
}
