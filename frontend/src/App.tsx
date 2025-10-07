import { useEffect } from "react";
import { useSocketStore } from "./store/socketStore";
import { GameBackground } from "./components/Background";
import { WelcomePage } from "./pages/WelcomePage";
import { useGameStore } from "./store/gameStore";
import { LobbyPage } from "./pages/LobbyPage";
import { GamePage } from "./pages/GamePage";
import { TableBackground } from "./components/Game/TableBackground";
import type { ServerToClientEvents } from "../../shared/types/socket";
import { LogOut } from "lucide-react";

export const App = () => {
  const socket = useSocketStore((store) => store.socket);
  const connect = useSocketStore((store) => store.connect);
  const disconnect = useSocketStore((store) => store.disconnect);

  const inGame = useGameStore((store) => store.inGame);
  const status = useGameStore((store) => store.status);

  useEffect(() => {
    if (socket?.connected) return;

    connect();

    return () => {
      disconnect();
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!socket?.active) return;

    const handlePlayerLeft: ServerToClientEvents["playerLeft"] = (data) => {
      const state = useGameStore.getState();

      const newPlayers = state.players.filter((p) => p.id !== data.playerId);

      state.setPlayers(newPlayers);
    };

    socket.on("playerLeft", handlePlayerLeft);

    return () => {
      socket.off("playerLeft", handlePlayerLeft);
    };
  }, [socket]);

  const leaveLobby = () => {
    socket?.emit("leaveLobby", { code: useGameStore.getState().code });
    setTimeout(() => {
      useGameStore.getState().leaveLobby();
    }, 10);
  };

  return (
    <>
      <GameBackground />
      {inGame && status !== "waiting" && <TableBackground />}
      <div className="w-screen h-screen flex justify-center items-center relative">
        {inGame ? (
          status === "waiting" ? (
            <LobbyPage />
          ) : (
            <GamePage />
          )
        ) : (
          <WelcomePage />
        )}
        {inGame && (
          <button
            onClick={leaveLobby}
            className="group fixed bottom-4 left-4 flex items-center overflow-hidden rounded-full bg-red-500 text-white shadow-lg transition-all duration-300 
  w-10 h-10 sm:w-12 sm:h-12 hover:sm:w-28 hover:bg-red-600 cursor-pointer hover:-translate-y-[2px]"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 absolute left-[10px] sm:left-[14px] transition-all duration-300 group-hover:ml-2 sm:group-hover:ml-3" />
            <span className="ml-2 whitespace-nowrap absolute left-[36px] sm:left-[42px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm sm:text-base">
              Leave
            </span>
          </button>
        )}
      </div>
    </>
  );
};
