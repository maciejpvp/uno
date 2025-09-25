type Player = {
  id: string;
  username: string;
};

type PlayerListProps = {
  players: Player[];
  maxPlayers?: number;
};

export const PlayerList = ({ players, maxPlayers = 4 }: PlayerListProps) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
      {players.map((player) => (
        <div
          key={player.id}
          className="relative flex justify-center items-center rounded-xl 
                     ring-2 ring-violet-400 px-4 py-2 overflow-hidden"
        >
          <div className="absolute inset-0 bg-violet-900/10 backdrop-blur-xl rounded-xl"></div>

          <div className="relative text-2xl font-semibold text-violet-100">
            {player.username}
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
  );
};
