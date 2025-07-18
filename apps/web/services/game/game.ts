import { CreateGameSessionType } from "@/lib/schema";
import { GameSession, Round } from "@/lib/types";
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

export const getSpecificGameSession = async (gameid: string) => {
  const res = await api.get(`/game/${gameid}`);

  if (res.status !== 200) {
    throw new Error("Failed to get game session");
  }

  return res.data as {
    data: GameSession;
    player1Wins: number;
    player2Wins: number;
    draws: number;
    roundNumber: number;
  };
};

export const endGameSession = async (gameid: string) => {
  const res = await api.patch(`/game/${gameid}/end`);

  if (res.status !== 200) {
    throw new Error("Failed to end game session");
  }

  return res.data as GameSession;
};

export const createGameRound = async (gameid: string, winner: string) => {
  const res = await api.post(`/game/${gameid}/round`, { winner });

  if (res.status !== 200) {
    throw new Error("Failed to create game round");
  }

  return res.data as Round;
};
