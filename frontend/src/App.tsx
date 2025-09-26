import { useEffect } from "react";
import { useSocketStore } from "./store/socketStore";
import { GameBackground } from "./components/Background";
import { WelcomePage } from "./pages/WelcomePage";
import { useGameStore } from "./store/gameStore";
import { LobbyPage } from "./pages/LobbyPage";
import { GamePage } from "./pages/GamePage";

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

  return (
    <>
      <GameBackground />
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
      </div>
    </>
  );
};
