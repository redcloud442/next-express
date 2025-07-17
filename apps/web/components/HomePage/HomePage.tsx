"use client";

import { GameSession } from "@/lib/types";
import { GameSessionKey, useGetGameSessions } from "@/query/game/game.query";
import { Button } from "@workspace/ui/components/button";
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
    <main className="container max-w-2xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Previous Game Sessions</h1>
        <StartGameButton />
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader size="lg" />
        </div>
      )}

      {!isLoading && gameSessions && (
        <div className="grid gap-4">
          {gameSessions.map((session: GameSession) => (
            <GameSessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {!isLoading && gameSessions.length === 0 && (
        <div className="text-center py-8 text-gray-500">No game sessions found. Start a new game to begin!</div>
      )}

      {!isLoading && hasNextPage && (
        <div className="flex justify-center py-8">
          <Button onClick={() => fetchNextPage()} disabled={isLoading}>
            Load more
          </Button>
        </div>
      )}
    </main>
  );
};

export default HomePage;
