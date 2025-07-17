import { GameSession } from "@/lib/types";
import { Card, CardContent } from "@workspace/ui/components/card";

const GameSessionCard = ({ session }: { session: GameSession }) => {
  return (
    <Card>
      <CardContent className="space-y-2 pt-4">
        <div className="text-lg font-semibold">
          {session.player1} vs {session.player2}
        </div>
        <div className="text-sm text-muted-foreground">Started:</div>
        {session.endedAt && <div className="text-sm text-muted-foreground">Ended:</div>}
        <div className="pt-2">
          <h4 className="font-medium">Rounds:</h4>
          <ul className="text-sm list-disc list-inside">
            {session.rounds.map((round) => (
              <li key={round.id}>
                Round {round.roundNumber}: Winner – {round.winner}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameSessionCard;
