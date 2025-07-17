import { prisma } from "../../../lib/prisma/prisma";

export const createGameSession = async (data: { player1: string; player2: string }) => {
  const gameSession = await prisma.gameSession.create({
    data: {
      player1: data.player1,
      player2: data.player2,
    },
    include: {
      rounds: true,
    },
  });

  return gameSession;
};

export const getGameSessions = async (params: { limit: number; page: number }) => {
  const gameSessions = await prisma.gameSession.findMany({
    include: {
      rounds: true,
    },
    skip: (params.page - 1) * params.limit,
    take: params.limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.gameSession.count();

  return {
    data: gameSessions,
    total,
  };
};
