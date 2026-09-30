/// <reference types="vite/client" />

// Type the environment variables we read via import.meta.env
interface ImportMetaEnv {
  readonly VITE_TMDB_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
