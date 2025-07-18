import { calculateDuration, FormatDate } from "@/lib/helper";
import { GameSession } from "@/lib/types";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Separator } from "@workspace/ui/components/separator";
import { Calendar, CheckCircle2, Circle, Clock, PlayCircle, Target, Trophy, Users } from "lucide-react";

const GameSessionCard = ({ session }: { session: GameSession }) => {
  const getGameStatus = () => {
    return session.endedAt ? "Completed" : "In Progress";
  };

  const player1Wins = session.rounds.filter((round) => round.winner === session.player1).length;
  const player2Wins = session.rounds.filter((round) => round.winner === session.player2).length;

  const duration = calculateDuration(session);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {session.player1} vs {session.player2}
              </h3>
              <p className="text-sm text-gray-500">Game Session</p>
            </div>
          </div>
          <Badge
            variant={session.endedAt ? "default" : "secondary"}
            className={session.endedAt ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}
          >
            {session.endedAt ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Circle className="w-3 h-3 mr-1" />}
            {getGameStatus()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Started: {FormatDate(session.createdAt)}</span>
          </div>

          {session.endedAt && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Duration: {duration}</span>
            </div>
          )}
        </div>

        {session.endedAt && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4" />
            <span>Ended: {FormatDate(session.endedAt)}</span>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-600" />
            <h4 className="font-semibold text-gray-900">Score Overview</h4>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{player1Wins}</div>
              <div className="text-sm text-gray-600 font-medium">{session.player1}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{player2Wins}</div>
              <div className="text-sm text-gray-600 font-medium">{session.player2}</div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-gray-900">Round Details</h4>
            <Badge variant="outline" className="ml-auto">
              {session.rounds.length} Round{session.rounds.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <ScrollArea className="space-y-2 h-40">
            {session.rounds.map((round) => (
              <div
                key={round.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-white rounded-full">
                    <PlayCircle className="w-3 h-3 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Round {round.roundNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-3 h-3 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900">{round.winner}</span>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Total Rounds: {session.rounds.length}</span>
            {session.endedAt && (
              <span>
                {player1Wins === player2Wins
                  ? "Tie Game"
                  : player1Wins > player2Wins
                    ? `${session.player1} Wins`
                    : `${session.player2} Wins`}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameSessionCard;
