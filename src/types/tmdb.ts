// Types for the parts of the TMDb API responses we use.
// Full reference: https://developer.themoviedb.org/reference

/** A movie as returned in lists (trending, search, discover). */
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string; // "YYYY-MM-DD", may be empty
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

/** Every list endpoint returns results in pages. */
export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string; // YouTube video ID
  name: string;
  site: string; // "YouTube", "Vimeo", ...
  type: string; // "Trailer", "Teaser", ...
  official: boolean;
}

/** Full movie details, including cast and videos via append_to_response. */
export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  genres: Genre[];
  runtime: number | null;
  tagline: string;
  credits: { cast: CastMember[] };
  videos: { results: Video[] };
}

/** Filters for the discover endpoint (bonus feature). */
export interface MovieFilters {
  genreId?: number;
  year?: number;
  minRating?: number;
}

export interface Account {
  id: number;
  username: string;
  name: string;
}
