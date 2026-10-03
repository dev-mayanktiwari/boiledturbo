import { z } from "zod";

export const createUserSchema = z.object({
  email: z.email(),
  name: z.string().min(1),
  username: z.string().min(5),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
