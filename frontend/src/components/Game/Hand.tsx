import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Card } from "../../../../shared/types/types";
import { CardComponent } from "./CardComponent";
import { useGameStore } from "../../store/gameStore";
import { useSocketStore } from "../../store/socketStore";

type HandProps = {
  cards: Card[];
};

type AnimatedCard = Card & {
  isAnimatingOut?: boolean;
};

type Layout = {
  width: number;
  height: number;
  getCardPosition: (index: number) => { top: number; left: number };
};

export const Hand = ({ cards }: HandProps) => {
  const currentTurn = useGameStore((store) => store.currentTurn);
  const players = useGameStore((store) => store.players);
  const socket = useSocketStore((store) => store.socket);

  const isMyTurn = players[currentTurn]?.id === socket?.id;

  const [renderedCards, setRenderedCards] = useState<AnimatedCard[]>(cards);
  const [layout, setLayout] = useState<Layout>(() => getLayout(cards.length));

  useEffect(() => {
    const removed = renderedCards.filter(
      (c) => !cards.some((nc) => nc.id === c.id),
    );

    if (removed.length > 0) {
      setRenderedCards((prev) =>
        prev.map((c) =>
          removed.some((r) => r.id === c.id)
            ? { ...c, isAnimatingOut: true }
            : c,
        ),
      );

      const timeout = setTimeout(() => {
        setRenderedCards(cards);
      }, 600);

      return () => clearTimeout(timeout);
    } else {
      setRenderedCards(cards);
    }
    //eslint-disable-next-line
  }, [cards]);

  function getLayout(cardsCount: number) {
    const containerWidth = window.innerWidth * 0.82;
    const containerHeight = window.innerHeight * 0.27;
    const cardWidth = 112;
    const cardHeight = 160;
    const gap = 10;

    const offsetY = window.innerHeight - 160 - 50;
    const offsetX = Math.max(
      window.innerWidth / 2 - ((cardWidth + gap) * cardsCount) / 2,
      (window.innerWidth - containerWidth) / 2 + 10,
    );

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
      const left = col * (cardWidth + gap) + offsetX;
      const top = row * (cardHeight + gap) + offsetY;
      return { top, left };
    };

    return { width, height, getCardPosition };
  }

  useEffect(() => {
    const handleResize = () => {
      setLayout(getLayout(renderedCards.length));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderedCards.length]);

  useEffect(() => {
    setLayout(getLayout(renderedCards.length));
  }, [renderedCards]);

  const { width, height, getCardPosition } = layout;

  return (
    <div className="p-4 pt-8 overflow-y-auto custom-scrollbar bg-red-900">
      <div style={{ width, height }} className="bg-blue-800">
        {renderedCards.map((card, idx) => {
          const { top, left } = getCardPosition(idx);

          const animate = card.isAnimatingOut
            ? {
                top: window.innerHeight / 2 - 80,
                left: window.innerWidth / 2 - 56,
              }
            : { top, left };

          return (
            <motion.div
              key={card.id}
              initial={{ top, left, position: "absolute" }}
              animate={animate}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ position: "absolute" }}
            >
              <CardComponent card={card} isMyTurn={isMyTurn} size="lg" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
