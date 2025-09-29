import { useGameStore } from "../../store/gameStore";
import { useSocketStore } from "../../store/socketStore";

type GameOverModalProps = {
  winner: string;
  onClose: () => void;
};

export const GameOverModal = ({ winner, onClose }: GameOverModalProps) => {
  const socket = useSocketStore((store) => store.socket);
  const ownerId = useGameStore((store) => store.ownerId);

  const amIOwner = socket?.id === ownerId;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-purple-800 flex flex-col gap-1 rounded-sm border-4 border-purple-600 shadow-[8px_8px_0px_rgba(0,0,0,0.7)] p-6 w-[320px] text-center">
        <h2 className="text-2xl text-white mb-4">🎉 Game Over 🎉</h2>
        <div>
          <p className="text-lg text-purple-200 mb-6">
            Winner: <span className="font-bold text-white">{winner}</span>
          </p>
          {amIOwner && (
            <button
              onClick={onClose}
              className="w-full bg-purple-600 text-white py-2 border-2 border-purple-400 hover:bg-purple-700 active:translate-y-1 transition-all"
            >
              Play Again
            </button>
          )}
          {!amIOwner && (
            <p className="text-purple-300">Waiting for new round...</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full text-white py-2 active:translate-y-1 transition-all cursor-pointer"
        >
          Leave Lobby
        </button>
      </div>
    </div>
  );
};
