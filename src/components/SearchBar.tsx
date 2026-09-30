import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const DEBOUNCE_MS = 500;

interface SearchBarProps {
  initialValue?: string;
  /** Called with the trimmed query after the user stops typing (or presses Enter) */
  onSearch: (query: string) => void;
}

/**
 * Search input with debouncing: we wait until the user pauses typing
 * before searching, instead of calling the API on every keystroke.
 */
function SearchBar({ initialValue = '', onSearch }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Cancel a pending search if the component unmounts
  useEffect(() => () => clearTimeout(timer.current), []);

  function handleChange(next: string) {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(next.trim()), DEBOUNCE_MS);
  }

  // Enter searches immediately
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    clearTimeout(timer.current);
    onSearch(value.trim());
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
            // Rounded ends need more inner space than square corners
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
            endAdornment: value && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} edge="end" aria-label="clear search">
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
