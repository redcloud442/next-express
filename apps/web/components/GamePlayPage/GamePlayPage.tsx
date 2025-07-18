"use client";

import { emptyBoard } from "@/lib/constant";
import { Cell } from "@/lib/types";
import { GameSessionKeyWithId, useFetchGameSession } from "@/query/game/game.query";
import { createGameRound, endGameSession } from "@/services/game/game";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

type GamePlayPageProps = {
  params: {
    gameid: string;
  };
};

const GamePlayPage = ({ params }: GamePlayPageProps) => {
  const { gameid } = params;

  const router = useRouter();
  const queryClient = useQueryClient();

  const [board, setBoard] = useState<Cell[][]>(structuredClone(emptyBoard));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<"PLAYER1" | "PLAYER2" | "DRAW" | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: session } = useFetchGameSession(GameSessionKeyWithId(gameid), { gameid });

  // Handle move
  const handleClick = (row: number, col: number) => {
    if (board[row]?.[col] || winner) return;
    const newBoard = board.map((r, i) => r.map((cell, j) => (i === row && j === col ? turn : cell))) as Cell[][];
    setBoard(newBoard);
    setTurn(turn === "X" ? "O" : "X");

    const result = checkWinner(newBoard);
    if (result) {
      const mapped = result === "X" ? "PLAYER1" : result === "O" ? "PLAYER2" : "DRAW";
      setWinner(mapped);
      setTimeout(() => {
        setShowModal(true);
      }, 300);
    }
  };

  // Check winner logic
  const checkWinner = (b: Cell[][]): "X" | "O" | "DRAW" | null => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (b[i]?.[0] !== "" && b[i]?.[0] === b[i]?.[1] && b[i]?.[1] === b[i]?.[2]) {
        return b[i]?.[0] as "X" | "O";
      }
      if (b[0]?.[i] !== "" && b[0]?.[i] === b[1]?.[i] && b[1]?.[i] === b[2]?.[i]) {
        return b[0]?.[i] as "X" | "O";
      }
    }

    // Check diagonals
    if (b[0]?.[0] !== "" && b[0]?.[0] === b[1]?.[1] && b[1]?.[1] === b[2]?.[2]) {
      return b[0]?.[0] as "X" | "O";
    }
    if (b[0]?.[2] !== "" && b[0]?.[2] === b[1]?.[1] && b[1]?.[1] === b[2]?.[0]) {
      return b[0]?.[2] as "X" | "O";
    }
    if (b.flat().every((c) => c !== "")) return "DRAW";
    return null;
  };

  // Submit round

  const mutation = useMutation({
    mutationFn: (winner: "PLAYER1" | "PLAYER2" | "DRAW") => createGameRound(gameid, winner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GameSessionKeyWithId(gameid) });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const submitRound = async () => {
    if (!winner) return;
    mutation.mutate(winner);
  };

  // Continue to next round
  const handleContinue = () => {
    setBoard(structuredClone(emptyBoard));
    setWinner(null);
    setTurn("X");
    setShowModal(false);
  };

  // Stop and end session
  const handleStop = async () => {
    await endGameSession(gameid);
    router.push("/");
  };

  const player1Wins = session?.rounds.filter((r) => r.winner === "PLAYER1").length ?? 0;
  const player2Wins = session?.rounds.filter((r) => r.winner === "PLAYER2").length ?? 0;
  const draws = session?.rounds.filter((r) => r.winner === "DRAW").length ?? 0;
  const roundNum = (session?.rounds.length ?? 0) + 1;

  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-2">Round {roundNum}</h1>
      <div className="flex justify-between text-sm text-muted-foreground">
        <p>
          {session?.player1} (X) Wins: {player1Wins}
        </p>
        <p>
          {session?.player2} (O) Wins: {player2Wins}
        </p>
        <p>Draws: {draws}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 w-60 mx-auto mt-6">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <Button
              key={`${i}-${j}-${cell}`}
              className={cn(
                "w-20 h-20 text-xl font-bold border rounded flex items-center justify-center",
                "hover:bg-accent disabled:opacity-50",
              )}
              disabled={!!cell || !!winner}
              onClick={() => handleClick(i, j)}
            >
              {cell}
            </Button>
          )),
        )}
      </div>

      {/* Prompt Modal */}
      <Dialog open={showModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {winner === "DRAW"
                ? "It’s a Draw!"
                : `${winner === "PLAYER1" ? session?.player1 : session?.player2} Wins!`}
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleStop}>
              Stop
            </Button>
            <Button
              onClick={async () => {
                await submitRound();
                handleContinue();
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamePlayPage;
