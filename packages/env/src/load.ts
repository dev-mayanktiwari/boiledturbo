import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

// packages/env/src/load.ts -> repo root
const ROOT_ENV_FILE = fileURLToPath(new URL("../../../.env", import.meta.url));

/**
 * Loads the repo-root `.env` into process.env. Call once at the start of each Node entry
 * point (server, prisma config, scripts). Existing variables are never overridden, so
 * values set by Docker, systemd or the shell win over the file. A missing file is fine:
 * on EC2 the variables usually come from the environment itself.
 */
export function loadRootEnv(): void {
  if (existsSync(ROOT_ENV_FILE)) {
    process.loadEnvFile(ROOT_ENV_FILE);
  }
}
