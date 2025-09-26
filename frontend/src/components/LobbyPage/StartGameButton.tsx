import { useGameStore } from "../../store/gameStore";
import { useSocketStore } from "../../store/socketStore";

type StartGameButtonProps = {
  disabled?: boolean;
};

export const StartGameButton = ({ disabled }: StartGameButtonProps) => {
  const socket = useSocketStore((store) => store.socket);
  const code = useGameStore((store) => store.code);

  const handleClick = () => {
    if (!socket?.active) return;

    socket.emit("startLobby", code);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative px-6 py-3 rounded-xl text-2xl font-bold
        text-violet-100 ring-2 ring-violet-400
        overflow-hidden backdrop-blur-xl
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:text-violet-50 hover:ring-violet-300 hover:scale-101
        active:scale-95 transition-all duration-150 ease-in-out
      `}
    >
      {/* Glowing background */}
      <div className="absolute inset-0 bg-violet-900/10 backdrop-blur-xl rounded-xl pointer-events-none"></div>

      <span className="relative drop-shadow-lg">Start Game</span>
    </button>
  );
};
