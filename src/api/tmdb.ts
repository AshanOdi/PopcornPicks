import axios from 'axios';
import type {
  Account,
  Genre,
  Movie,
  MovieDetails,
  MovieFilters,
  PaginatedResponse,
} from '../types/tmdb';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/**
 * Shared axios instance for every TMDb request.
 * The Read Access Token is sent as a Bearer token, so no api_key query param is needed.
 */
const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/** Builds a full image URL from a TMDb path. Returns null when there is no image. */
export function imageUrl(path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500') {
  return path ? `${IMAGE_BASE_URL}/${size}${path}` : null;
}

/** Turns any API error into a short, user-friendly message. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Network error. Please check your internet connection.';
    switch (error.response.status) {
      case 401:
        return 'Invalid username or password, or the API token is not valid.';
      case 404:
        return 'We could not find what you were looking for.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      default:
        return error.response.data?.status_message ?? 'Something went wrong. Please try again.';
    }
  }
  return 'Something went wrong. Please try again.';
}

// ---------- Movies ----------

export async function getTrendingMovies(page = 1) {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>('/trending/movie/week', { params: { page } });
  return data;
}

export async function searchMovies(query: string, page = 1) {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
}

/** Details, cast and videos in a single request. */
export async function getMovieDetails(id: number) {
  const { data } = await tmdb.get<MovieDetails>(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' },
  });
  return data;
}

export async function getGenres() {
  const { data } = await tmdb.get<{ genres: Genre[] }>('/genre/movie/list');
  return data.genres;
}

export async function discoverMovies(filters: MovieFilters, page = 1) {
  const { data } = await tmdb.get<PaginatedResponse<Movie>>('/discover/movie', {
    params: {
      page,
      sort_by: 'popularity.desc',
      include_adult: false,
      with_genres: filters.genreId,
      primary_release_year: filters.year,
      'vote_average.gte': filters.minRating,
      'vote_count.gte': filters.minRating ? 50 : undefined, // avoid 10/10 movies with 1 vote
    },
  });
  return data;
}

// ---------- Authentication ----------
// TMDb login flow: request token -> validate it with username/password -> create a session.

export async function login(username: string, password: string) {
  const { data: tokenData } = await tmdb.get<{ request_token: string }>('/authentication/token/new');

  await tmdb.post('/authentication/token/validate_with_login', {
    username,
    password,
    request_token: tokenData.request_token,
  });

  const { data: sessionData } = await tmdb.post<{ session_id: string }>('/authentication/session/new', {
    request_token: tokenData.request_token,
  });

  return sessionData.session_id;
}

export async function getAccount(sessionId: string) {
  const { data } = await tmdb.get<Account>('/account', { params: { session_id: sessionId } });
  return data;
}

export async function logout(sessionId: string) {
  await tmdb.delete('/authentication/session', { data: { session_id: sessionId } });
}
