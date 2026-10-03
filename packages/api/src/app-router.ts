import { router } from "./trpc";
import { userRouter } from "./routes/user";

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
