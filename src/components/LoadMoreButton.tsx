import { Box, Button, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface LoadMoreButtonProps {
  hasMore: boolean;
  loading: boolean;
  onClick: () => void;
}

/** "Load more" button for paginated lists. Hidden when there are no more pages. */
function LoadMoreButton({ hasMore, loading, onClick }: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <Box sx={{ textAlign: 'center', mt: 3 }}>
      <Button
        variant="outlined"
        size="large"
        onClick={onClick}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ExpandMoreIcon />}
        sx={{ minWidth: 180 }}
      >
        {loading ? 'Loading...' : 'Load more'}
      </Button>
    </Box>
  );
}

export default LoadMoreButton;
