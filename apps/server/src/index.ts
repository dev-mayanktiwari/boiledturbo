import "./load-env";
import { appRouter } from "@repo/api";
import { createDb } from "@repo/db";
import { ENV } from "@repo/env/server";
import { success } from "@repo/common/errors";
import { logger } from "@repo/common/logger";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import { registerProcessErrorHandlers } from "./process-handlers";

registerProcessErrorHandlers();

// Validates all server env here. A bad or missing variable stops the process at boot
// with a message listing every problem.
const port = ENV.SERVER.get("PORT");
const db = createDb(ENV.SERVER.get("DATABASE_URL"));

const app = express();

app.use(express.json());

app.use(
  "/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({ db }),
  }),
);

app.get("/health", (_req, res) => {
  res.json(success({ status: "ok" }, "Service is healthy"));
});

// Must come after every real route.
app.use(notFoundHandler);
// Must be last: catches everything passed to next(err), including the 404s above.
app.use(errorHandler);

app.listen(port, () => {
  logger.info("server listening", { port });
});
