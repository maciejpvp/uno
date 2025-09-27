import { useEffect } from "react";
import { Hand } from "../components/Game/Hand";
import { useGameStore } from "../store/gameStore";
import { useSocketStore } from "../store/socketStore";
import type { ServerToClientEvents } from "../../../shared/types/socket";
import { CardComponent } from "../components/Game/CardComponent";
import { BackHand } from "../components/Game/BackHand";

export const GamePage = () => {
  const discardPile = useGameStore((store) => store.discardPile);
  const hand = useGameStore((store) => store.hand);
  const players = useGameStore((store) => store.players);
  const currentTurn = useGameStore((store) => store.currentTurn);
  const socket = useSocketStore((store) => store.socket);

  const lastPileCard = discardPile.at(-1);

  useEffect(() => {
    if (!socket?.active) return;

    const handleCardPlayed: ServerToClientEvents["cardPlayed"] = (data) => {
      const state = useGameStore.getState();

      state.setDiscardPile([...state.discardPile, data.card]);
      state.setCurrentTurn(data.currentTurn);
      state.setHand(data.hand);

      const updatedPlayers = data.players.map((p) => {
        const existing = state.players.find((pl) => pl.id === p.id);
        return {
          id: p.id,
          username: existing?.username ?? "Unknown",
          cardCount: p.handCount,
        };
      });

      state.setPlayers(updatedPlayers);
    };

    const handleCardDrawn: ServerToClientEvents["cardDrawn"] = (data) => {
      const state = useGameStore.getState();
      state.setHand(data.hand);
    };

    socket.on("cardPlayed", handleCardPlayed);
    socket.on("cardDrawn", handleCardDrawn);

    return () => {
      socket.off("cardPlayed", handleCardPlayed);
      socket.off("cardDrawn", handleCardDrawn);
    };
  }, [socket]);

  const handleDrawCard = () => {
    socket?.emit("drawCard", { code: useGameStore.getState().code });
  };

  if (!lastPileCard) return null;

  const myId = socket?.id;
  const meIndex = players.findIndex((p) => p.id === myId);

  const rotatedPlayers =
    meIndex === -1
      ? players
      : [...players.slice(meIndex), ...players.slice(0, meIndex)];

  const right = rotatedPlayers[1];
  const top = rotatedPlayers[2];
  const left = rotatedPlayers[3];

  const isMyTurn = players[currentTurn]?.id === myId;

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-between p-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center flex flex-col gap-2">
        <CardComponent card={lastPileCard} />
        {isMyTurn && (
          <button
            onClick={handleDrawCard}
            className="mt-3 px-4 py-2 rounded-lg bg-indigo-900 text-indigo-50 shadow-md hover:bg-indigo-800 transition-all"
          >
            Draw Card
          </button>
        )}
      </div>

      {top && (
        <BackHand
          username={top.username}
          cardCount={top.cardCount}
          highlight={players[currentTurn]?.id === top.id}
          orientation="top"
        />
      )}

      <div className="flex flex-1 w-full items-center justify-between">
        {left && (
          <BackHand
            username={left.username}
            cardCount={left.cardCount}
            highlight={players[currentTurn]?.id === left.id}
            orientation="left"
          />
        )}

        {right && (
          <BackHand
            username={right.username}
            cardCount={right.cardCount}
            highlight={players[currentTurn]?.id === right.id}
            orientation="right"
          />
        )}
      </div>

      <div className="flex flex-col items-center mb-4 pb-4 relative">
        <p
          className={`text-lg font-semibold
               text-yellow-400 animate-pulse absolute -top-2`}
        >
          {isMyTurn ? "Your Turn" : ""}
        </p>
        <Hand cards={hand} />
      </div>
    </div>
  );
};
