import { z } from "zod";

export const CreateGameSessionSchema = z.object({
  player1: z.string().min(1),
  player2: z.string().min(1),
});

export type CreateGameSessionType = z.infer<typeof CreateGameSessionSchema>;
