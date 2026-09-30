import { Box, Card, Skeleton } from '@mui/material';

/** Grey placeholder with the same shape as a MovieCard, shown while loading. */
function MovieCardSkeleton() {
  return (
    <Card>
      <Skeleton variant="rectangular" sx={{ aspectRatio: '2 / 3', height: 'auto' }} />
      <Box sx={{ p: 1.5 }}>
        <Skeleton width="80%" />
        <Skeleton width="30%" />
      </Box>
    </Card>
  );
}

export default MovieCardSkeleton;
