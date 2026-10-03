import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Next.js only loads .env files from apps/web. Load the repo-root .env as well so the
// NEXT_PUBLIC_* values are available at build time. Variables already set in the
// environment (CI, Docker build args) are never overridden.
const ROOT_ENV_FILE = fileURLToPath(new URL("../../.env", import.meta.url));
if (existsSync(ROOT_ENV_FILE)) {
  process.loadEnvFile(ROOT_ENV_FILE);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // @repo/env is TypeScript source, so Next has to compile it.
  transpilePackages: ["@repo/env"],
};

export default nextConfig;
