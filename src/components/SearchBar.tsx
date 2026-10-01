import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const DEBOUNCE_MS = 500;

interface SearchBarProps {
  initialValue?: string;
  /** Called with the trimmed query after the user stops typing (or presses Enter), or "" when cleared */
  onSearch: (query: string) => void;
  /** A search is currently shown. Keeps the ✕ visible even when the box is empty, so the user can always leave search. */
  active?: boolean;
}

/**
 * Search input with debouncing: we wait until the user pauses typing
 * before searching, instead of calling the API on every keystroke.
 *
 * Erasing the text does NOT end the search: the current results stay until a new name is typed,
 * so changing searches doesn't flash back to the home page. Only ✕ (or Esc) leaves search.
 */
function SearchBar({ initialValue = '', onSearch, active = false }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Cancel a pending search if the component unmounts
  useEffect(() => () => clearTimeout(timer.current), []);

  function handleChange(next: string) {
    setValue(next);
    clearTimeout(timer.current);
    const query = next.trim();
    // Empty box while typing: keep the current results (user is about to type a new name)
    if (!query) return;
    timer.current = setTimeout(() => onSearch(query), DEBOUNCE_MS);
  }

  // Enter searches immediately (an empty box does nothing)
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    clearTimeout(timer.current);
    const query = value.trim();
    if (query) onSearch(query);
  }

  function handleClear() {
    clearTimeout(timer.current);
    setValue('');
    onSearch('');
  }

  return (
    <Box component="form" onSubmit={handleSubmit} role="search">
      <TextField
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        // Esc works like the ✕ button
        onKeyDown={(e) => {
          if (e.key === 'Escape' && (value || active)) handleClear();
        }}
        placeholder="Search for a movie..."
        fullWidth
        size="medium"
        // Glass pill: rounded, semi-transparent, blurred, with a soft shadow
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 999,
            bgcolor: 'rgba(var(--mui-palette-background-paperChannel) / 0.8)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
            // Rounded ends need more inner space than square corners.
            // Right: 12px + the clear button's own 8px padding ≈ the 20px on the left, so both icons sit evenly.
            pl: 2.5,
            pr: 1.5,
          },
          '& .MuiInputAdornment-positionStart': { mr: 1.5, color: 'text.secondary' },
        }}
        slotProps={{
          htmlInput: { 'aria-label': 'search movies' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (value || active) && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} aria-label="clear search">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}

export default SearchBar;
