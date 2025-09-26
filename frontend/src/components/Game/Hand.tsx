import type { Card } from "../../../../shared/types/types";
import { CardComponent } from "./CardComponent";

type HandProps = {
  cards: Card[];
};

export const Hand = ({ cards }: HandProps) => {
  return (
    <div className="flex gap-2 justify-center mt-4">
      {cards.map((card, idx) => (
        <CardComponent key={idx} card={card} />
      ))}
    </div>
  );
};
