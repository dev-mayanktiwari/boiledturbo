import { definePrismaConfig } from "@prisma/cli-engine";
import { defineConfig as ormConfig } from "@prisma/orm-postgres/config";
import { loadRootEnv } from "@repo/env/load";
import { ENV } from "@repo/env/server";

// Prisma CLI runs this file directly, so it has to load the root .env itself.
loadRootEnv();

export default definePrismaConfig({
  orm: ormConfig({
    contract: "./src/prisma/contract.prisma",
    db: {
      connection: ENV.SERVER.get("DATABASE_URL"),
    },
  }),
});
