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
    <div className="overflow-x-auto p-4 max-w-[95dvw] custom-scrollbar pt-8">
      <div className="flex gap-[-40px] min-w-max">
        {cards.map((card, idx) => (
          <CardComponent key={idx} card={card} isMyTurn={isMyTurn} />
        ))}
      </div>
    </div>
  );
};
