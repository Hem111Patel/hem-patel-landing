/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OURA_ACCESS_TOKEN?: string;
  readonly VITE_POLAR_ACCESS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
