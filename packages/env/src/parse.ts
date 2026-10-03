import type { z } from "zod";

type EnvInput = Record<string, string | undefined>;

/**
 * Validates `input` against `schema` and throws one error listing every bad key, so a
 * misconfigured deploy shows all problems at once instead of one per restart.
 */
export function parseEnv<S extends z.ZodObject>(scope: string, schema: S, input: EnvInput): z.infer<S> {
  const result = schema.safeParse(input);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid ${scope} environment variables:\n${issues}`);
  }
  return result.data;
}

/**
 * Returns a getter that parses on first call and caches the result. Parsing is deferred
 * so importing a module never throws. Only the entry point that actually needs the
 * config triggers validation.
 */
export function lazyEnv<S extends z.ZodObject>(
  scope: string,
  schema: S,
  read: () => EnvInput,
): () => z.infer<S> {
  let cached: z.infer<S> | undefined;
  return () => {
    cached ??= parseEnv(scope, schema, read());
    return cached;
  };
}

/** Typed `ENV.X.get(NAME)` accessor built on a lazy getter. */
export function createScope<S extends z.ZodObject>(getAll: () => z.infer<S>) {
  return {
    get<K extends keyof z.infer<S>>(name: K): z.infer<S>[K] {
      return getAll()[name];
    },
  };
}
