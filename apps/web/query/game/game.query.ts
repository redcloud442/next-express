import { getGameSessions, getSpecificGameSession } from "@/services/game/game";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const GameSessionKey = () => ["game-sessions"] as const;

export const useGetGameSessions = (key: ReturnType<typeof GameSessionKey>, params: { take: number }) => {
  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam = 1 }) => getGameSessions(params.take, pageParam),
    getNextPageParam: (lastPage, pages) => (lastPage.total > pages.length * params.take ? pages.length + 1 : undefined),
    initialPageParam: 1,
  });
};

export const GameSessionKeyWithId = (gameid: string) => ["game-session", gameid] as const;

export const useFetchGameSession = (key: ReturnType<typeof GameSessionKeyWithId>, params: { gameid: string }) => {
  return useQuery({
    queryKey: key,
    queryFn: () => getSpecificGameSession(params.gameid),
  });
};
