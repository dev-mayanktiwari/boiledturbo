import { loadRootEnv } from "@repo/env/load";

// Imported first in index.ts. ES imports run in order, so this loads the root .env
// before any module that reads env.
loadRootEnv();
