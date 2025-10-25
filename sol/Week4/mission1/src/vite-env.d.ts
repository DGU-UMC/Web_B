/// <reference types="vite/client" />
interface ImportMetaEnv {
  VITE_TMDB_KEY: string;
}

interface ImportMeta {
  readonly env: VITE_TMDB_KEY;
}
