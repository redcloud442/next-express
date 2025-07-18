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
    include: {
      rounds: true,
    },
  });

  const player1Wins = gameSession.rounds.filter((round) => round.winner === gameSession.player1).length;
  const player2Wins = gameSession.rounds.filter((round) => round.winner === gameSession.player2).length;
  const draws = gameSession.rounds.filter((round) => round.winner === "DRAW").length;
  const roundNumber = gameSession.rounds.length + 1;

  return {
    data: gameSession,
    player1Wins,
    player2Wins,
    draws,
    roundNumber,
  };
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

export const createGameRound = async (data: { winner: string; gameid: string }) => {
  const roundNumber = await prisma.round.count({
    where: {
      sessionId: data.gameid,
    },
  });

  const gameSession = await prisma.round.create({
    data: {
      winner: data.winner,
      roundNumber: roundNumber + 1,
      gameSession: {
        connect: {
          id: data.gameid,
        },
      },
    },
  });

  return gameSession;
};
