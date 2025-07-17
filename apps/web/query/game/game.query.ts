import { getGameSessions } from "@/services/game/game";
import { useInfiniteQuery } from "@tanstack/react-query";

export const GameSessionKey = () => ["game-sessions"] as const;

export const useGetGameSessions = (key: ReturnType<typeof GameSessionKey>, params: { take: number }) => {
  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam = 1 }) => getGameSessions(params.take, pageParam),
    getNextPageParam: (lastPage, pages) => (lastPage.total > pages.length * params.take ? pages.length + 1 : undefined),
    initialPageParam: 1,
  });
};
