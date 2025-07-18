import { Winner } from "@prisma/client";
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


export const getSpecificGameSession = async (data: { gameid: string }) => {
  const gameSession = await prisma.gameSession.findUniqueOrThrow({
    where: {
      id: data.gameid,
      game_status: "active",
    },
  });

  return gameSession;
};

export const endGameSession = async (data: { gameid: string }) => {
    const gameSession = await prisma.gameSession.update({
      where: {
        id: data.gameid,
      },
      data: {
        endedAt: new Date(),
        game_status: "ended",
      },
    });

    return gameSession;
  };

  export const createGameRound = async (data: { winner: Winner; gameid: string }) => {
    const gameSession = await prisma.round.create({
      data: {
        winner: data.winner,
       roundNumber:1,
        gameSession: {
          connect: {
            id: data.gameid,
          },
        },
      },
    });

    return gameSession;
  };
