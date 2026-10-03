import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import contractJson from "./contract.json" with { type: "json" };

/**
 * Takes the connection string from the caller instead of reading env here, so importing
 * this package never has side effects. The server entry point creates the client once.
 */
export function createDb(url: string) {
  return postgres<Contract>({
    contractJson,
    url,
  });
}

export type Db = ReturnType<typeof createDb>;
