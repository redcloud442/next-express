"use client";

import { GameSession } from "@/lib/types";
import { GameSessionKey, useGetGameSessions } from "@/query/game/game.query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Separator } from "@workspace/ui/components/separator";
import { ChevronDown, Play } from "lucide-react";
import Loader from "../Loader";
import GameSessionCard from "./GameSessionCard";
import StartGameButton from "./StartGameButton";

const HomePage = () => {
  const take = 10;

  const {
    data: gameSessionsResponse,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetGameSessions(GameSessionKey(), { take });

  const gameSessions = gameSessionsResponse?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Your Tic Tac Toe Journey
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track game progress, review past sessions, and continue your adventure
            </p>
          </div>

          <div className="flex justify-center">
            <StartGameButton />
          </div>
        </div>

        <Separator className="my-8" />

        {!isLoading && gameSessions.length > 0 && (
          <div className="grid grid-cols-1  gap-4 mb-8">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{gameSessions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-900">Game Sessions</h2>
              <p className="text-sm text-gray-600">
                {gameSessions.length > 0
                  ? `${gameSessions.length} session${gameSessions.length === 1 ? "" : "s"} found`
                  : "No sessions yet"}
              </p>
            </div>
            {gameSessions.length > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {gameSessions.length} Total
              </Badge>
            )}
          </div>

          {isLoading && (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12">
                <div className="flex flex-col items-center gap-4">
                  <Loader size="lg" />
                  <p className="text-gray-600">Loading your game sessions...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && gameSessions.length > 0 && (
            <div className="grid gap-4">
              {gameSessions.map((session: GameSession) => (
                <div key={session.id} className="transform hover:scale-[1.02] transition-transform duration-200">
                  <GameSessionCard session={session} />
                </div>
              ))}
            </div>
          )}

          {!isLoading && gameSessions.length === 0 && (
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-12">
                <div className="text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">No game sessions yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Start your first game session to begin tracking your gaming journey and achievements.
                    </p>
                  </div>
                  <div className="pt-4">
                    <StartGameButton />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && hasNextPage && (
            <div className="flex justify-center pt-6">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isLoading}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                Load More Sessions
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
