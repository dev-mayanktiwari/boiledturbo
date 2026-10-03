import { z } from "zod";
import { createScope, lazyEnv } from "./parse";

/**
 * Browser-safe variables. Only `NEXT_PUBLIC_*` names belong here, because Next.js inlines
 * them into the client bundle at build time. The `read` function must reference each
 * variable literally, since the bundler can't inline a dynamic `process.env[name]`.
 */
const clientSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
});

export type ClientEnv = z.infer<typeof clientSchema>;

const getClientEnv = lazyEnv("client", clientSchema, () => ({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
}));

export const ENV = {
  CLIENT: createScope<typeof clientSchema>(getClientEnv),
};
