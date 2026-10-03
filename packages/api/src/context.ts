import type { Db } from "@repo/db";

/**
 * The server builds this once and passes it in, so the api package never reads env or
 * creates connections on its own.
 */
export interface Context {
  db: Db;
}
