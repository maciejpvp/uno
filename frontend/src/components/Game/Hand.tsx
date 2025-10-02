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

  const getLayout = (cardsCount: number) => {
    const containerWidth = window.innerWidth * 0.82; // 82dvw
    const containerHeight = window.innerHeight * 0.27; // 27dvh
    const cardWidth = 112;
    const cardHeight = 160;
    const gap = 10;

    const cardsPerRow = Math.max(
      1,
      Math.floor(containerWidth / (cardWidth + gap)),
    );

    const rows = Math.ceil(cardsCount / cardsPerRow);

    const width = Math.min((cardWidth + gap) * cardsCount, containerWidth);
    const height = Math.min((cardHeight + gap) * rows, containerHeight);

    const getCardPosition = (index: number) => {
      const row = Math.floor(index / cardsPerRow);
      const col = index % cardsPerRow;

      const left = col * (cardWidth + gap);
      const top = row * (cardHeight + gap);

      return { top, left };
    };

    return { width, height, getCardPosition };
  };

  return (
    <div className="p-4 pt-8 relative overflow-y-auto custom-scrollbar">
      {(() => {
        const { width, height, getCardPosition } = getLayout(cards.length);
        return (
          <div style={{ position: "relative", width, height }}>
            {cards.map((card, idx) => {
              const { top, left } = getCardPosition(idx);
              return (
                <CardComponent
                  key={card.id}
                  card={card}
                  isMyTurn={isMyTurn}
                  size="lg"
                  top={top}
                  left={left}
                />
              );
            })}
          </div>
        );
      })()}
    </div>
  );
};
