import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

function MovieDetails() {
  // Read the movie id from the URL, e.g. /movie/550 -> "550"
  const { id } = useParams();

  return <Typography variant="h4">Movie #{id}</Typography>;
}

export default MovieDetails;
