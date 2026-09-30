import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import TrendingMovies from '../components/TrendingMovies';
import { useMovies } from '../hooks/useMovies';

/** Search bar on top; shows search results while searching, trending movies otherwise. */
function Home() {
  const { lastSearch, setLastSearch } = useMovies();

  return (
    <>
      <SearchBar initialValue={lastSearch} onSearch={setLastSearch} />

      {/* key={lastSearch} gives each new search a fresh SearchResults (page 1, empty list) */}
      {lastSearch ? <SearchResults key={lastSearch} query={lastSearch} /> : <TrendingMovies />}
    </>
  );
}

export default Home;
