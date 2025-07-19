"use client";

import { checkWinner, createEmptyBoard } from "@/lib/helper";
import { Cell } from "@/lib/types";
import { GameSessionKeyWithId, useFetchGameSession } from "@/query/game/game.query";
import { createGameRound, endGameSession } from "@/services/game/game";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { Separator } from "@workspace/ui/components/separator";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowLeft, Circle, Crown, Play, StopCircle, Target, Trophy, Users, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type GamePlayPageProps = {
  params: {
    gameid: string;
  };
};

const GamePlayPage = ({ params }: GamePlayPageProps) => {
  const { gameid } = params;

  const router = useRouter();
  const queryClient = useQueryClient();

  const emptyBoard = createEmptyBoard();

  const [board, setBoard] = useState<Cell[][]>(structuredClone(emptyBoard));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { data: session, error, isLoading } = useFetchGameSession(GameSessionKeyWithId(gameid), { gameid });

  if (error) {
    router.push("/");
  }

  const handleClick = (row: number, col: number) => {
    if (board[row]?.[col] || winner) return;

    const newBoard = board.map((r, i) => r.map((cell, j) => (i === row && j === col ? turn : cell))) as Cell[][];

    const nextTurn = turn === "X" ? "O" : "X";
    const result = checkWinner(newBoard);

    setBoard(newBoard);
    setTurn(nextTurn);

    if (result) {
      const mapped = result === "X" ? session?.data.player1 : result === "O" ? session?.data.player2 : "DRAW";

      if (!mapped) return;
      setWinner(mapped);
      mutation.mutate(mapped);
      setTimeout(() => setShowModal(true), 300);
    }
  };

  const mutation = useMutation({
    mutationFn: (winner: string) => createGameRound(gameid, winner),
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleContinue = () => {
    setBoard(structuredClone(emptyBoard));
    setWinner(null);
    setTurn("X");
    setShowModal(false);

    queryClient.invalidateQueries({ queryKey: GameSessionKeyWithId(gameid) });
  };

  const handleStop = async () => {
    await endGameSession(gameid);
    router.push("/");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  if (isLoading || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-96 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-600">Loading game session...</p>
              <Skeleton className="w-full h-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPlayer = turn === "X" ? session.data.player1 : session.data.player2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
            <Target className="w-3 h-3 mr-1" />
            Round {session.roundNumber}
          </Badge>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center flex-wrap justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {session.data.player1} vs {session.data.player2}
                  </CardTitle>
                  <p className="text-sm text-gray-600">Tic-tac-toe Battle</p>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium sm:w-fit w-full justify-center",
                  turn === "X" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700",
                )}
              >
                {currentPlayer}'s Turn
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <XIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{session.data.player1} (X)</p>
                    <p className="text-2xl font-bold text-blue-600">{session.player1Wins}</p>
                  </div>
                </div>
                {session.player1Wins > session.player2Wins && <Crown className="w-5 h-5 text-yellow-500" />}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Circle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{session.data.player2} (O)</p>
                    <p className="text-2xl font-bold text-purple-600">{session.player2Wins}</p>
                  </div>
                </div>
                {session.player2Wins > session.player1Wins && <Crown className="w-5 h-5 text-yellow-500" />}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Trophy className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Draws</p>
                  <p className="text-2xl font-bold text-gray-600">{session.draws}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              {board.map((row, i) =>
                row.map((cell, j) => (
                  <Button
                    key={`${i}-${j}-${cell}`}
                    className={cn(
                      "w-24 h-24 text-4xl font-bold border-2 rounded-lg transition-all duration-200",
                      "hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100",
                      cell === "X" && "bg-blue-100 text-blue-600 border-blue-300",
                      cell === "O" && "bg-purple-100 text-purple-600 border-purple-300",
                      !cell && "bg-gray-50 border-gray-200 hover:bg-gray-100",
                    )}
                    disabled={!!cell || !!winner}
                    onClick={() => handleClick(i, j)}
                  >
                    {cell}
                  </Button>
                )),
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showModal}>
        <DialogContent className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl text-center">
              {winner === "DRAW" ? "It's a Draw!" : ` ${winner} Wins!`}
            </DialogTitle>
            <p className="text-gray-600 text-center">
              {winner === "DRAW" ? "Great game! Both players played well." : `Congratulations! Well played!`}
            </p>
          </DialogHeader>
          <Separator />
          <DialogFooter className="flex justify-center gap-3 pt-4">
            <Button variant="outline" onClick={handleStop} className="flex items-center gap-2">
              <StopCircle className="w-4 h-4" />
              End Game
            </Button>
            <Button onClick={handleContinue} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Continue Playing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GamePlayPage;
