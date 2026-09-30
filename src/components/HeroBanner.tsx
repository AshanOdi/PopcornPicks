import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import TrailerButton from "./TrailerButton";
import FavoriteButton from "./FavoriteButton";
import { getMovieDetails, getTrendingMovies, imageUrl } from "../api/tmdb";
import { formatLanguage, formatRuntime } from "../utils/format";
import type { MovieDetails } from "../types/tmdb";

/**
 * Full-bleed layout:
 * - width 100vw + negative side margin breaks out of the centered page container
 * - negative top margin cancels Layout's top padding (16px / 32px),
 *   so the hero starts right below the navbar
 */
const FULL_BLEED = {
  position: "relative",
  width: "100vw",
  ml: "calc(50% - 50vw)",
  mt: { xs: -2, sm: -4 },
  height: { xs: "72vh", md: "74vh" },
  minHeight: { xs: 480, md: 520 },
  maxHeight: 700,
} as const;

/** Dot between meta items, e.g. "★ 7.8 • 2h 15m • English". */
const Dot = () => (
  <Box component="span" sx={{ opacity: 0.5 }}>
    •
  </Box>
);

/**
 * Cinematic featured movie at the top of Home: the #1 trending movie that has a backdrop.
 * Decorative, so if it fails to load it simply hides (the rows below still work).
 */
function HeroBanner() {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let ignore = false;

    getTrendingMovies()
      .then((data) => {
        const featured =
          data.results.find((m) => m.backdrop_path) ?? data.results[0];
        if (!featured) throw new Error("No trending movies");
        // Details include genres, runtime, language and videos (for the trailer)
        return getMovieDetails(featured.id);
      })
      .then((details) => {
        if (!ignore) setMovie(details);
      })
      .catch(() => {
        if (!ignore) setFailed(true);
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (failed) return null;
  if (!movie)
    return (
      <Skeleton
        variant="rectangular"
        sx={{ ...FULL_BLEED, height: FULL_BLEED.height }}
      />
    );

  const backdrop = imageUrl(movie.backdrop_path, "original");
  const year = movie.release_date?.slice(0, 4);

  return (
    <Box
      component="section"
      aria-label="Featured movie"
      sx={{
        ...FULL_BLEED,
        color: "#fff",
        bgcolor: "#000",
        backgroundImage: backdrop ? `url(${backdrop})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center 20%",
      }}
    >
      {/* Readability: dark from the left (desktop) / from the bottom (phones) behind the white text */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: {
            xs: "linear-gradient(0deg, rgba(0,0,0,0.95) 20%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.15) 100%)",
            md: "linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.1) 70%)",
          },
        }}
      />
      {/* Blend into the page: fade to the page background at the bottom (search + rows) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, var(--mui-palette-background-default), transparent 12%)",
        }}
      />

      {/* Content lines up with the page content via the same centered Container */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <Box sx={{ pb: { xs: 10, md: 13 }, maxWidth: { md: 600 } }}>
          <Chip
            icon={<WhatshotIcon />}
            label="#1 Trending this week"
            color="primary"
            size="small"
            sx={{ mb: 2 }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" },
              lineHeight: 1.05,
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            }}
          >
            {movie.title}
          </Typography>

          {/* Rating • Runtime • Language • Year */}
          <Stack
            direction="row"
            spacing={1.25}
            useFlexGap
            sx={{
              flexWrap: "wrap",
              alignItems: "center",
              mt: 2,
              fontWeight: 600,
            }}
          >
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <StarIcon sx={{ color: "#f5c518", fontSize: 20 }} />
              <span>{movie.vote_average.toFixed(1)}</span>
            </Stack>
            {movie.runtime ? (
              <>
                <Dot />
                <span>{formatRuntime(movie.runtime)}</span>
              </>
            ) : null}
            <Dot />
            <span>{formatLanguage(movie.original_language)}</span>
            {year && (
              <>
                <Dot />
                <span>{year}</span>
              </>
            )}
          </Stack>

          {/* Genre tags */}
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ flexWrap: "wrap", mt: 1.5 }}
          >
            {movie.genres.slice(0, 4).map((genre) => (
              <Chip
                key={genre.id}
                label={genre.name}
                size="small"
                variant="outlined"
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.4)",
                  bgcolor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(4px)",
                }}
              />
            ))}
          </Stack>

          {/* Overview clamped to a few lines so the banner height stays fixed */}
          <Typography
            sx={{
              mt: 2,
              opacity: 0.85,
              maxWidth: 560,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: { xs: 2, sm: 3 },
              overflow: "hidden",
            }}
          >
            {movie.overview}
          </Typography>

          <Stack
            direction="row"
            spacing={1.5}
            useFlexGap
            sx={{ flexWrap: "wrap", mt: 3 }}
          >
            <TrailerButton videos={movie.videos.results} title={movie.title} />
            <Button
              component={RouterLink}
              to={`/movie/${movie.id}`}
              variant="outlined"
              size="large"
              startIcon={<InfoOutlinedIcon />}
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.5)",
                backdropFilter: "blur(4px)",
              }}
            >
              Details
            </Button>
            <FavoriteButton movie={movie} variant="button" />
          </Stack>
        </Box>
      </Container>

      {/* Play circle over the backdrop (desktop).
          Rendered after the Container + zIndex, so the container can't cover it and the whole circle is clickable. */}
      <Box
        sx={{
          position: "absolute",
          top: "42%",
          right: "18%",
          zIndex: 2,
          display: { xs: "none", md: "block" },
        }}
      >
        <TrailerButton
          videos={movie.videos.results}
          title={movie.title}
          variant="circle"
        />
      </Box>
    </Box>
  );
}

export default HeroBanner;
