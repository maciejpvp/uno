import { PlusCircleIcon } from "lucide-react";
import { useSocketStore } from "../store/socketStore";
import { useGameStore } from "../store/gameStore";

export const CreateLobbyButton = () => {
  const socket = useSocketStore((store) => store.socket);

  const handleCreateLobby = () => {
    if (!socket?.active) return;

    socket.emit("createLobby", (res) => {
      if (!res.success) return;

      const lobby = res.data;

      const state = useGameStore.getState();

      state.setInGame(true);
      state.setCode(lobby.code);
      state.setOwnerId(lobby.ownerId);
      state.setPlayers(
        lobby.players.map((p) => ({ id: p.id, username: p.username })),
      );
      state.setStatus(lobby.status);
    });
  };

  return (
    <div
      className="
        flex flex-col items-center justify-center gap-1
        transition-all duration-300 ease-in-out
        hover:scale-105 active:scale-95
      hover:gap-2
      "
    >
      <button
        onClick={handleCreateLobby}
        className="
          text-violet-100 text-sm font-medium
          px-5 py-2.5 rounded-lg
          border border-violet-400/40
          bg-violet-700/30
          hover:border-violet-300 hover:bg-violet-800/50
          active:bg-violet-900/60
          transition-all duration-300 ease-in-out
          flex flex-row justify-center items-center gap-2
          shadow-md hover:shadow-lg active:shadow-sm
        "
      >
        Create a new game
        <PlusCircleIcon className="transition-transform duration-300 ease-in-out group-hover:rotate-90" />
      </button>
      <p className="text-violet-200 text-xs">
        Start a new game and invite friends
      </p>
    </div>
  );
};
