import { Crown } from "lucide-react";
import { StartGameButton } from "./StartGameButton";

type Player = {
  id: string;
  username: string;
};

type PlayerListProps = {
  players: Player[];
  ownerId: string;
  maxPlayers?: number;
};

export const PlayerList = ({
  players,
  ownerId,
  maxPlayers = 4,
}: PlayerListProps) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
        {players.map((player) => (
          <div
            key={player.id}
            className="relative flex justify-between items-center rounded-xl 
                     ring-2 ring-violet-400 px-4 py-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-violet-900/10 backdrop-blur-xl rounded-xl"></div>

            <div className="relative text-2xl font-semibold text-violet-100 flex items-center gap-2">
              {player.username}
              {player.id === ownerId && (
                <Crown className="w-5 h-5 text-yellow-400 drop-shadow" />
              )}
            </div>
          </div>
        ))}

        {Array.from({ length: maxPlayers - players.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="relative flex justify-center items-center rounded-xl 
                     ring-2 ring-violet-400 px-4 py-2 overflow-hidden opacity-30"
          >
            <div className="absolute inset-0 bg-violet-900/10 backdrop-blur-xl rounded-xl"></div>
            <div className="relative text-2xl font-semibold text-violet-100">
              Waiting...
            </div>
          </div>
        ))}
      </div>
      <StartGameButton />
    </div>
  );
};
