import { Code } from "../components/LobbyPage/Code";
import { PlayerList } from "../components/LobbyPage/PlayerList";
import { useGameStore } from "../store/gameStore";

export const LobbyPage = () => {
  const code = useGameStore((store) => store.code);
  const players = useGameStore((store) => store.players);

  return (
    <div className="h-screen w-screen py-[5vh]  relative flex flex-col items-center justify-center">
      <div className="absolute top-[5vh]">
        <Code code={code} />
      </div>
      <PlayerList players={players} />
    </div>
  );
};
