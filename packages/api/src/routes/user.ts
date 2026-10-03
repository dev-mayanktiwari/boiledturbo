import { AppError, success } from "@repo/common/errors";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  // Returns the same { success, message, data } envelope Express uses, so a tRPC
  // caller and a REST caller see an identically shaped payload on success.
  listUsers: publicProcedure.query(() => {
    return success(["demo-user"], "Users fetched");
  }),

  // Demonstrates the AppError -> tRPC error plumbing: throws a structured, business-coded
  // error the client can branch on via `error.data.code`, never a raw stack trace.
  getById: publicProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
    if (input.id !== "1") {
      throw new AppError("NOT_FOUND", "User not found", { details: { id: input.id } });
    }
    return success({ id: "1", username: "demo-user" }, "User fetched");
  }),
});
