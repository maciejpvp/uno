import { useEffect } from "react";
import { Code } from "../components/LobbyPage/Code";
import { PlayerList } from "../components/LobbyPage/PlayerList";
import { useGameStore } from "../store/gameStore";
import { useSocketStore } from "../store/socketStore";
import type { ServerToClientEvents } from "../../../shared/types/socket";

export const LobbyPage = () => {
  const code = useGameStore((store) => store.code);
  const players = useGameStore((store) => store.players);
  const setPlayers = useGameStore((store) => store.setPlayers);
  const ownerId = useGameStore((store) => store.ownerId);

  const socket = useSocketStore((store) => store.socket);

  useEffect(() => {
    if (!socket?.active) return;

    const handlePlayerJoined = (
      player: Parameters<ServerToClientEvents["playerJoined"]>[0],
    ) => {
      setPlayers([
        ...players,
        { id: player.id, username: player.username, cardCount: 7 },
      ]);
    };

    const handleGameStarted = (
      data: Parameters<ServerToClientEvents["lobbyStart"]>[0],
    ) => {
      const state = useGameStore.getState();

      state.setStatus("playing");
      state.setHand(data.hand);
      state.setDiscardPile([data.pile]);
      state.setCurrentTurn(data.currentTurn);
    };

    socket.on("playerJoined", handlePlayerJoined);
    socket.on("lobbyStart", handleGameStarted);

    return () => {
      socket.off("playerJoined", handlePlayerJoined);
      socket.off("lobbyStart", handleGameStarted);
    };
  }, [socket, players, setPlayers]);

  return (
    <div className="h-screen w-screen py-[5vh]  relative flex flex-col items-center justify-center">
      <div className="absolute top-[5vh]">
        <Code code={code} />
      </div>
      <PlayerList players={players} ownerId={ownerId} />
    </div>
  );
};
