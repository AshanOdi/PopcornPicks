import { Box, Stack } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import StarIcon from '@mui/icons-material/Star';
import TheatersIcon from '@mui/icons-material/Theaters';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import MovieRow from '../components/MovieRow';
import HeroBanner from '../components/HeroBanner';
import { useMovies } from '../hooks/useMovies';
import { getNowPlayingMovies, getTopRatedMovies, getTrendingMovies } from '../api/tmdb';

/**
 * Home page:
 * - browsing  -> full-width hero, search pill overlapping its bottom edge, then movie rows
 * - searching -> search pill on top, then the results grid (infinite scroll)
 */
function Home() {
  const { lastSearch, setLastSearch } = useMovies();
  const searching = Boolean(lastSearch);

  /** New search (or cleared search): save it and jump back to the top, so results start from the beginning. */
  function handleSearch(query: string) {
    if (query === lastSearch) return;
    setLastSearch(query);
    window.scrollTo({ top: 0 });
  }

  return (
    <>
      {/* `searching ? null : ...` keeps the SearchBar at the same place in the React tree,
          so the input keeps focus when the hero disappears while typing */}
      {searching ? null : <HeroBanner />}

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 720,
          mx: 'auto',
          mt: searching ? 0 : { xs: -4, sm: -5 }, // overlap the hero's bottom edge
          mb: { xs: 3, sm: 4 },
        }}
      >
        <SearchBar initialValue={lastSearch} onSearch={handleSearch} active={searching} />
      </Box>

      {/* key={lastSearch} gives each new search a fresh SearchResults (page 1, empty list) */}
      {searching ? (
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
