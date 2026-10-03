import { z } from "zod";
import { createScope, lazyEnv } from "./parse";

/**
 * Server-only variables. Import from `@repo/env/server` in Node code only. Never import
 * it from a Next.js client component, because it would expose these names to the bundle.
 */
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
});

export type ServerEnv = z.infer<typeof serverSchema>;

const getServerEnv = lazyEnv("server", serverSchema, () => process.env);

export const ENV = {
  SERVER: createScope<typeof serverSchema>(getServerEnv),
};
