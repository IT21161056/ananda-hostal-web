/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // add other environment variables here as needed
  readonly ENVIRONMENT: "DEVELOPMENT" | "PRODUCTION";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
