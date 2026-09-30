import { useEffect, useState } from 'react';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { getGenres } from '../api/tmdb';
import type { Genre, MovieFilters } from '../types/tmdb';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1950 + 1 }, (_, i) => CURRENT_YEAR - i);
const RATINGS = [5, 6, 7, 8];

/**
 * Open each dropdown BELOW its field. By default MUI places the menu on top of the field,
 * so the mouse release from the opening click could land on an option and select it by accident.
 */
const selectSlotProps = {
  select: {
    MenuProps: {
      anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
      transformOrigin: { vertical: 'top', horizontal: 'left' },
      slotProps: { paper: { sx: { maxHeight: 320, mt: 0.5 } } },
    },
  },
} as const;

interface MovieFiltersBarProps {
  value: MovieFilters;
  onChange: (filters: MovieFilters) => void;
}

/** Genre, year and minimum rating dropdowns. An empty selection means "any". */
function MovieFiltersBar({ value, onChange }: MovieFiltersBarProps) {
  const [genres, setGenres] = useState<Genre[]>([]);

  // Load the genre list once; if it fails, the genre dropdown just stays empty
  useEffect(() => {
    getGenres()
      .then(setGenres)
      .catch(() => setGenres([]));
  }, []);

  const hasFilters = value.genreId !== undefined || value.year !== undefined || value.minRating !== undefined;

  /** Converts a dropdown value ("" = any) to a number or undefined. */
  const toNumber = (v: string) => (v === '' ? undefined : Number(v));

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 2 }} sx={{ mb: 3 }}>
      <TextField
        select
        slotProps={selectSlotProps}
        label="Genre"
        size="small"
        value={value.genreId ?? ''}
        onChange={(e) => onChange({ ...value, genreId: toNumber(e.target.value) })}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">All genres</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={genre.id}>
            {genre.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        slotProps={selectSlotProps}
        label="Year"
        size="small"
        value={value.year ?? ''}
        onChange={(e) => onChange({ ...value, year: toNumber(e.target.value) })}
        sx={{ minWidth: 120 }}
      >
        <MenuItem value="">Any year</MenuItem>
        {YEARS.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        slotProps={selectSlotProps}
        label="Rating"
        size="small"
        value={value.minRating ?? ''}
        onChange={(e) => onChange({ ...value, minRating: toNumber(e.target.value) })}
        sx={{ minWidth: 120 }}
      >
        <MenuItem value="">Any rating</MenuItem>
        {RATINGS.map((rating) => (
          <MenuItem key={rating} value={rating}>
            {rating}+ ★
          </MenuItem>
        ))}
      </TextField>

      {hasFilters && (
        <Button startIcon={<FilterAltOffIcon />} onClick={() => onChange({})}>
          Clear filters
        </Button>
      )}
    </Stack>
  );
}

export default MovieFiltersBar;
