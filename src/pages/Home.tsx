import { Stack } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import StarIcon from '@mui/icons-material/Star';
import TheatersIcon from '@mui/icons-material/Theaters';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import MovieRow from '../components/MovieRow';
import { useMovies } from '../hooks/useMovies';
import { getNowPlayingMovies, getTopRatedMovies, getTrendingMovies } from '../api/tmdb';

/**
 * Home page:
 * - searching -> search results grid (infinite scroll)
 * - otherwise -> browsable rows, each with "See all" to the Discover page
 */
function Home() {
  const { lastSearch, setLastSearch } = useMovies();

  return (
    <>
      <SearchBar initialValue={lastSearch} onSearch={setLastSearch} />

      {/* key={lastSearch} gives each new search a fresh SearchResults (page 1, empty list) */}
      {lastSearch ? (
        <SearchResults key={lastSearch} query={lastSearch} />
      ) : (
        <Stack spacing={{ xs: 3, sm: 4 }}>
          <MovieRow
            title="Trending this week"
            icon={<WhatshotIcon color="primary" />}
            fetchPage={getTrendingMovies}
            seeAllTo="/discover?list=trending"
          />
          <MovieRow
            title="Top rated"
            icon={<StarIcon color="primary" />}
            fetchPage={getTopRatedMovies}
            seeAllTo="/discover?list=top_rated"
          />
          <MovieRow
            title="Now playing"
            icon={<TheatersIcon color="primary" />}
            fetchPage={getNowPlayingMovies}
            seeAllTo="/discover?list=now_playing"
          />
        </Stack>
      )}
    </>
  );
}

export default Home;
