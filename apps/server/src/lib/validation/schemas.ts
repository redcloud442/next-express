import { z } from "zod";

export const createGameSessionSchema = z.object({
  player1: z.string(),
  player2: z.string(),
});

export const getGameSessionsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
});

export type CreateGameSessionSchema = z.infer<typeof createGameSessionSchema>;
export type GetGameSessionsSchema = z.infer<typeof getGameSessionsSchema>;
