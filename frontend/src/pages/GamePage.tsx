import { useEffect } from "react";
import { Hand } from "../components/Game/Hand";
import { useGameStore } from "../store/gameStore";
import { useSocketStore } from "../store/socketStore";
import type { ServerToClientEvents } from "../../../shared/types/socket";
import { CardComponent } from "../components/Game/CardComponent";

export const GamePage = () => {
  const discardPile = useGameStore((store) => store.discardPile);
  const hand = useGameStore((store) => store.hand);
  const socket = useSocketStore((store) => store.socket);

  const lastPileCard = discardPile.at(-1);

  useEffect(() => {
    if (!socket?.active) return;

    const handleCardPlayed: ServerToClientEvents["cardPlayed"] = (data) => {
      console.log(data);
      const state = useGameStore.getState();

      state.setDiscardPile([...state.discardPile, data.card]);
      state.setCurrentTurn(data.currentTurn);
      state.setHand(data.hand);
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
  }, [socket, hand]);

  const handleDrawCard = () => {
    socket?.emit("drawCard", { code: useGameStore.getState().code });
  };

  if (lastPileCard === undefined) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div>
        <div className="mt-2">
          <CardComponent card={lastPileCard} />
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold">Your Hand</p>
        <Hand cards={hand} />
      </div>
      <button onClick={handleDrawCard}>Draw Card</button>
    </div>
  );
};
