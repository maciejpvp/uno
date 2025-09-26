import type { Card } from "../../../../shared/types/types";
import { CardComponent } from "./CardComponent";
import { useGameStore } from "../../store/gameStore";
import { useSocketStore } from "../../store/socketStore";

type HandProps = {
  cards: Card[];
};

export const Hand = ({ cards }: HandProps) => {
  const currentTurn = useGameStore((store) => store.currentTurn);
  const players = useGameStore((store) => store.players);
  const socket = useSocketStore((store) => store.socket);

  const isMyTurn = players[currentTurn]?.id === socket?.id;

  return (
    <div className="flex gap-2 justify-center mt-4">
      {cards.map((card, idx) => (
        <CardComponent key={idx} card={card} isMyTurn={isMyTurn} />
      ))}
    </div>
  );
};
