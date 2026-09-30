import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tab, Tabs, Typography } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import StarIcon from '@mui/icons-material/Star';
import TheatersIcon from '@mui/icons-material/Theaters';
import TuneIcon from '@mui/icons-material/Tune';
import MovieFiltersBar from '../components/MovieFiltersBar';
import PaginatedMovieGrid from '../components/PaginatedMovieGrid';
import { discoverMovies, getNowPlayingMovies, getTopRatedMovies, getTrendingMovies } from '../api/tmdb';
import type { MovieFilters } from '../types/tmdb';

/** Ready-made lists, selectable with tabs or linked from "See All" (e.g. /discover?list=top_rated). */
const LISTS = {
  trending: { label: 'Trending', icon: <WhatshotIcon color="primary" />, fetchPage: getTrendingMovies },
  top_rated: { label: 'Top Rated', icon: <StarIcon color="primary" />, fetchPage: getTopRatedMovies },
  now_playing: { label: 'Now Playing', icon: <TheatersIcon color="primary" />, fetchPage: getNowPlayingMovies },
};

type ListKey = keyof typeof LISTS;

const isListKey = (value: string | null): value is ListKey => value !== null && value in LISTS;

/** Reads a number from the URL ("" or missing -> undefined). */
const numberParam = (value: string | null) => (value ? Number(value) : undefined);

/**
 * Discover page: browse a list (tabs) or filter by genre, year and rating.
 * Everything is stored in the URL, so Back works and links can be shared.
 */
function Discover() {
  const [params, setParams] = useSearchParams();

  const listParam = params.get('list');
  const list: ListKey = isListKey(listParam) ? listParam : 'trending';

  const genreId = numberParam(params.get('genre'));
  const year = numberParam(params.get('year'));
  const minRating = numberParam(params.get('rating'));
  const filters: MovieFilters = { genreId, year, minRating };
  const hasFilters = genreId !== undefined || year !== undefined || minRating !== undefined;

  // Depend on the individual numbers (not the filters object, which is new on every render)
  const fetchFiltered = useCallback(
    (page: number) => discoverMovies({ genreId, year, minRating }, page),
    [genreId, year, minRating],
  );

  function handleFiltersChange(next: MovieFilters) {
    const nextParams = new URLSearchParams();
    if (next.genreId !== undefined) nextParams.set('genre', String(next.genreId));
    if (next.year !== undefined) nextParams.set('year', String(next.year));
    if (next.minRating !== undefined) nextParams.set('rating', String(next.minRating));
    // No filters left -> go back to the list that was selected
    setParams(nextParams.size ? nextParams : { list });
  }

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        Discover
      </Typography>

      {/* Tabs switch between lists; picking one clears the filters */}
      <Tabs
        value={hasFilters ? false : list}
        onChange={(_, value: ListKey) => setParams({ list: value })}
        variant="scrollable"
        allowScrollButtonsMobile
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        {(Object.keys(LISTS) as ListKey[]).map((key) => (
          <Tab key={key} value={key} label={LISTS[key].label} />
        ))}
      </Tabs>

      <MovieFiltersBar value={filters} onChange={handleFiltersChange} />

      {hasFilters ? (
        <PaginatedMovieGrid
          key={params.toString()}
          title="Filtered movies"
          icon={<TuneIcon color="primary" />}
          fetchPage={fetchFiltered}
          emptyMessage="No movies match these filters."
        />
      ) : (
        <PaginatedMovieGrid key={list} title={LISTS[list].label} icon={LISTS[list].icon} fetchPage={LISTS[list].fetchPage} />
      )}
    </>
  );
}

export default Discover;
