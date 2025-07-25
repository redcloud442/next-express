export type GameSession = {
  id: string;
  player1: string;
  player2: string;
  createdAt: string;
  endedAt?: string | null;
  rounds: Round[];
};

export type Round = {
  id: string;
  winner: string;
  roundNumber: number;
  createdAt: string;
};

export type Cell = "X" | "O" | "";
