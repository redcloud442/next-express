import { Cell, GameSession } from "./types";

export const FormatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const checkWinner = (b: Cell[][]): "X" | "O" | "DRAW" | null => {
  const lines: [number, number][][] = [
    // Rows
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    // Columns
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    // Diagonals
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  for (const line of lines) {
    if (line.length !== 3) continue;
    const [first, second, third] = line;
    if (!first || !second || !third) continue;
    const [a1, a2] = first;
    const [b1, b2] = second;
    const [c1, c2] = third;
    const cell = b[a1]?.[a2];
    if (cell && cell === b[b1]?.[b2] && cell === b[c1]?.[c2]) {
      return cell as "X" | "O";
    }
  }
  if (b.flat().every((c) => c !== "")) return "DRAW";
  return null;
};

export const createEmptyBoard = (size = 3): Cell[][] =>
  Array.from({ length: size }, () => Array(size).fill("") as Cell[]);

export const calculateDuration = (session: GameSession) => {
  if (!session.endedAt) return null;
  const start = new Date(session.createdAt);
  const end = new Date(session.endedAt);
  const diffInMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  } else {
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}m`;
  }
};
