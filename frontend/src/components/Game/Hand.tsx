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
    <div className="p-4 pt-8 max-w-[86dvw]">
      <div className="flex flex-wrap justify-center gap-2 max-h-[33dvh] overflow-y-auto custom-scrollbar p-2">
        {cards.map((card, idx) => (
          <CardComponent key={idx} card={card} isMyTurn={isMyTurn} size="lg" />
        ))}
      </div>
    </div>
  );
};
