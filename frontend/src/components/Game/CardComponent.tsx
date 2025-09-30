import { useEffect, useRef, useState } from "react";
import type { Card } from "../../../../shared/types/types";
import { useGameStore } from "../../store/gameStore";
import { useSocketStore } from "../../store/socketStore";

import { SkipForward, RefreshCcw, Plus } from "lucide-react";
import { ChooseColor } from "./ChooseColor";

type CardComponentProps = {
  card: Card;
  isMyTurn?: boolean;
  size?: "sm" | "md" | "lg";
};

export const CardComponent = ({
  card,
  isMyTurn = true,
  size = "md",
}: CardComponentProps) => {
  const [choosing, setChoosing] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const updateCoords = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setCoords({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
        });
      }
    };

    updateCoords();
    window.addEventListener("scroll", updateCoords, true);
    window.addEventListener("resize", updateCoords);

    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [choosing]);

  const socket = useSocketStore((store) => store.socket);
  const lastCard = useGameStore((store) => store.discardPile.at(-1));

  const colors: Record<Card["color"], string> = {
    red: "from-red-500 to-red-700",
    green: "from-green-500 to-green-700",
    blue: "from-blue-500 to-blue-700",
    yellow: "from-yellow-400 to-yellow-600",
    black: "from-gray-700 to-black",
  };

  const sizeClasses: Record<
    typeof size,
    { card: string; icon: string; text: string }
  > = {
    sm: { card: "w-14 h-20", icon: "w-6 h-6", text: "text-xl" },
    md: { card: "w-20 h-28", icon: "w-10 h-10", text: "text-3xl" },
    lg: { card: "w-28 h-40", icon: "w-14 h-14", text: "text-5xl" },
  };

  const currentSize = sizeClasses[size];
  const bgGradient = colors[card.color];

  const canPlay = (() => {
    if (!lastCard) return true;
    if (card.color === "black") {
      if (card.value === "wild-draw-four") {
        const hand = useGameStore.getState().hand;
        const hasMatchingColor = hand.some(
          (c) => c.color === lastCard.color && c.color !== "black",
        );
        return !hasMatchingColor;
      }
      return true;
    }
    return card.color === lastCard.color || card.value === lastCard.value;
  })();

  const handlePlayCard = () => {
    if (!socket?.active || !canPlay) return;

    if (card.value === "wild" || card.value === "wild-draw-four") {
      setChoosing(true);
      return;
    }

    const code = useGameStore.getState().code;
    socket.emit("playCard", { code, card });
  };

  const handleChooseColor = (color: "red" | "green" | "blue" | "yellow") => {
    if (!socket?.active) return;
    const code = useGameStore.getState().code;
    socket.emit("playCard", { code, card, chosenColor: color });
    setChoosing(false);
  };

  const renderValue = () => {
    switch (card.value) {
      case "skip":
        return <SkipForward className={currentSize.icon} />;
      case "reverse":
        return <RefreshCcw className={currentSize.icon} />;
      case "draw-two":
        return (
          <div className="flex items-center gap-1">
            <Plus
              className={`${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6"}`}
            />
            <span
              className={`${size === "sm" ? "text-sm" : size === "lg" ? "text-2xl" : "text-lg"} font-bold`}
            >
              2
            </span>
          </div>
        );
      case "wild":
        return (
          <div
            className={`grid grid-cols-2 gap-1 ${size === "sm" ? "w-8 h-8" : size === "lg" ? "w-16 h-16" : "w-12 h-12"}`}
          >
            <div className="rounded-sm bg-red-500" />
            <div className="rounded-sm bg-green-500" />
            <div className="rounded-sm bg-blue-500" />
            <div className="rounded-sm bg-yellow-400" />
          </div>
        );
      case "wild-draw-four":
        return (
          <div className="flex flex-col items-center">
            <div
              className={`grid grid-cols-2 gap-0.5 mb-1 ${size === "sm" ? "w-6 h-6" : size === "lg" ? "w-14 h-14" : "w-10 h-10"}`}
            >
              <div className="rounded-sm bg-red-500" />
              <div className="rounded-sm bg-green-500" />
              <div className="rounded-sm bg-blue-500" />
              <div className="rounded-sm bg-yellow-400" />
            </div>
            <div className="flex items-center gap-1">
              <Plus
                className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-6 h-6" : "w-5 h-5"}`}
              />
              <span
                className={`${size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-md"} font-bold`}
              >
                4
              </span>
            </div>
          </div>
        );
      default:
        return (
          <span className={`${currentSize.text} font-extrabold`}>
            {card.value}
          </span>
        );
    }
  };

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <button
        disabled={!isMyTurn || !canPlay}
        onClick={handlePlayCard}
        className={`${currentSize.card} rounded-2xl flex items-center justify-center 
                    text-white shadow-xl border-4 border-white
                    bg-gradient-to-br ${bgGradient}
                    transform transition-transform duration-200 ease-in-out
                    hover:scale-110 active:scale-95
                    ${!isMyTurn || !canPlay ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        <div className="drop-shadow-lg">{renderValue()}</div>
      </button>

      {choosing && (
        <ChooseColor
          onChoose={handleChooseColor}
          coords={coords}
          close={() => setChoosing(false)}
        />
      )}
    </div>
  );
};
