import { CreateGameSessionType } from "@/lib/schema";
import { GameSession } from "@/lib/types";
import { api } from "../axios";

export const createGameSession = async (data: CreateGameSessionType) => {
  const res = await api.post("/game", data);

  if (res.status !== 201) {
    throw new Error("Failed to create game session");
  }

  return res.data as GameSession;
};

export const getGameSessions = async (limit: number, page: number) => {
  const res = await api.get("/game", { params: { limit, page } });

  if (res.status !== 200) {
    throw new Error("Failed to get game sessions");
  }

  return res.data as {
    data: GameSession[];
    total: number;
  };
};
