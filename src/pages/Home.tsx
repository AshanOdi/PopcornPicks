import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import TrendingMovies from '../components/TrendingMovies';
import MovieFiltersBar from '../components/MovieFiltersBar';
import FilteredMovies from '../components/FilteredMovies';
import { useMovies } from '../hooks/useMovies';
import type { MovieFilters } from '../types/tmdb';

/**
 * Home page:
 * - searching  -> search results (infinite scroll)
 * - filtering  -> filtered movies (Load More)
 * - otherwise  -> trending movies (Load More)
 */
function Home() {
  const { lastSearch, setLastSearch } = useMovies();
  const [filters, setFilters] = useState<MovieFilters>({});

  const hasFilters = Object.values(filters).some((v) => v !== undefined);

  return (
    <>
      <SearchBar initialValue={lastSearch} onSearch={setLastSearch} />

      {/* key={lastSearch} gives each new search a fresh SearchResults (page 1, empty list) */}
      {lastSearch ? (
        <SearchResults key={lastSearch} query={lastSearch} />
      ) : (
        <>
          <MovieFiltersBar value={filters} onChange={setFilters} />
          {hasFilters ? <FilteredMovies key={JSON.stringify(filters)} filters={filters} /> : <TrendingMovies />}
        </>
      )}
    </>
  );
}

export default Home;
