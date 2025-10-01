/// <reference types="vite/client" / >
// vite의 환경 변수 타입 추론을 위한 파일
interface ImportMetaEnv {
  readonly VITE_TMDB_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
