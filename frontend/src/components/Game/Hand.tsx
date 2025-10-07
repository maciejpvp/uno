import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Card } from "../../../../shared/types/types";
import { CardComponent } from "./CardComponent";
import { useGameStore } from "../../store/gameStore";
import { useSocketStore } from "../../store/socketStore";
import { isMobile } from "react-device-detect";

type HandProps = {
  cards: Card[];
  setDiscardPileOffset: React.Dispatch<React.SetStateAction<number>>;
};

type AnimatedCard = Card & {
  isAnimatingOut?: boolean;
};

type Layout = {
  width: number;
  height: number;
  getCardPosition: (index: number) => { top: number; left: number };
  offset: number;
};
function getLayout(
  cardsCount: number,
  size: "lg" | "md" | "sm" | "xs",
  setSize: React.Dispatch<React.SetStateAction<"lg" | "md" | "sm" | "xs">>,
  setDiscardPileOffset: React.Dispatch<React.SetStateAction<number>>,
) {
  const containerWidth = window.innerWidth * 0.82;
  // const containerHeight = window.innerHeight * 0.27;

  const sizes = {
    xs: { cardWidth: 40, cardHeight: 56 },
    sm: { cardWidth: 56, cardHeight: 80 },
    md: { cardWidth: 80, cardHeight: 112 },
    lg: { cardWidth: 112, cardHeight: 160 },
  };
  const cardWidth = sizes[size].cardWidth;
  const cardHeight = sizes[size].cardHeight;
  const gap = 10; //10;

  const cardsPerRow = Math.max(
    1,
    Math.floor(containerWidth / (cardWidth + gap)),
  );
  const rows = Math.ceil(cardsCount / cardsPerRow);

  // On Mobile Phones i always want to use xs size
  if (!isMobile) {
    if (rows > 2) {
      console.log(size);
      if (size === "lg") setSize("md");
      if (size === "md") setSize("sm");
    }
    if (rows === 1) {
      if (size === "sm") setSize("md");
      if (size === "md") setSize("lg");
    }
  }

  const width = Math.min((cardWidth + gap) * cardsCount, containerWidth);
  const height = (cardHeight + gap) * rows;

  const getCardPosition = (index: number) => {
    const row = Math.floor(index / cardsPerRow);
    const col = index % cardsPerRow;
    const left = col * (cardWidth + gap) + offsetX;
    const top = row * (cardHeight + gap) + offsetY;
    return { top, left };
  };

  const offsetY = window.innerHeight + (isMobile ? 6 : -35) - height;
  const offsetX = Math.max(
    window.innerWidth / 2 - ((cardWidth + gap) * cardsCount) / 2,
    (window.innerWidth - containerWidth) / 2 + 10,
  );

  const doIt = window.innerHeight * 0.3; // 40dvh = 40% of viewport height

  const offset = height > doIt ? height - doIt : 0;

  setDiscardPileOffset(offset);

  return { width, height, getCardPosition, offset };
}

export const Hand = ({ cards, setDiscardPileOffset }: HandProps) => {
  const currentTurn = useGameStore((store) => store.currentTurn);
  const players = useGameStore((store) => store.players);
  const socket = useSocketStore((store) => store.socket);

  const isMyTurn = players[currentTurn]?.id === socket?.id;

  const [renderedCards, setRenderedCards] = useState<AnimatedCard[]>(cards);
  const [size, setSize] = useState<"lg" | "md" | "sm" | "xs">(() =>
    isMobile ? "xs" : "lg",
  );
  const [layout, setLayout] = useState<Layout>(() =>
    getLayout(cards.length, size, setSize, setDiscardPileOffset),
  );

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

  useEffect(() => {
    const handleResize = () => {
      setLayout(
        getLayout(renderedCards.length, size, setSize, setDiscardPileOffset),
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderedCards.length, size, setDiscardPileOffset]);

  useEffect(() => {
    setLayout(
      getLayout(renderedCards.length, size, setSize, setDiscardPileOffset),
    );
  }, [renderedCards, size, setDiscardPileOffset]);

  const { width, height, getCardPosition, offset } = layout;

  return (
    <div className="p-4 pt-8 overflow-y-auto custom-scrollbar">
      <div style={{ width, height }} className="">
        {renderedCards.map((card, idx) => {
          const { top, left } = getCardPosition(idx);

          const animate = card.isAnimatingOut
            ? {
                top: window.innerHeight / 2 - (isMobile ? 30 : 110) - offset,
                left: window.innerWidth / 2 - (isMobile ? 28 : 56),
              }
            : { top, left };

          return (
            <motion.div
              key={card.id}
              initial={{ top, left, position: "absolute" }}
              animate={animate}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute"
            >
              <CardComponent
                card={card}
                isMyTurn={isMyTurn}
                size={card.isAnimatingOut ? (isMobile ? "sm" : "lg") : size}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
