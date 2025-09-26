import { useEffect } from "react";
import { Hand } from "../components/Game/Hand";
import { useGameStore } from "../store/gameStore";
import { useSocketStore } from "../store/socketStore";
import type { ServerToClientEvents } from "../../../shared/types/socket";

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

      state.setDiscardPile(data.discardPile);
      state.setCurrentTurn(data.currentTurn);

      if (socket.id === data.playerId) {
        state.setHand(
          hand.filter(
            (c) =>
              !(c.color === data.card.color && c.value === data.card.value),
          ),
        );
      }
    };

    socket.on("cardPlayed", handleCardPlayed);

    return () => {
      socket.off("cardPlayed", handleCardPlayed);
    };
  }, [socket, hand]);

  if (lastPileCard === undefined) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div>
        <p className="text-lg font-semibold">Discard Pile</p>
        {/* Show top card */}
        <div className="mt-2">
          {/* reuse same CardComponent */}
          <Hand cards={[lastPileCard]} />
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold">Your Hand</p>
        <Hand cards={hand} />
      </div>
    </div>
  );
};
