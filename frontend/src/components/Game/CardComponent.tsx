import { useState } from "react";
import type { Card } from "../../../../shared/types/types";
import { useGameStore } from "../../store/gameStore";
import { useSocketStore } from "../../store/socketStore";

// lucide-react icons
import { SkipForward, RefreshCcw, Plus } from "lucide-react";

type CardComponentProps = {
  card: Card;
  isMyTurn?: boolean;
};

export const CardComponent = ({
  card,
  isMyTurn = true,
}: CardComponentProps) => {
  const [choosing, setChoosing] = useState(false);

  const socket = useSocketStore((store) => store.socket);
  const lastCard = useGameStore((store) => store.discardPile.at(-1));

  const colors: Record<Card["color"], string> = {
    red: "from-red-500 to-red-700",
    green: "from-green-500 to-green-700",
    blue: "from-blue-500 to-blue-700",
    yellow: "from-yellow-400 to-yellow-600",
    black: "from-gray-700 to-black",
  };

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

    if (card.color === lastCard.color || card.value === lastCard.value)
      return true;

    return false;
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

  const bgGradient = colors[card.color];

  // map values to icons
  const renderValue = () => {
    switch (card.value) {
      case "skip":
        return <SkipForward className="w-10 h-10" />;
      case "reverse":
        return <RefreshCcw className="w-10 h-10" />;
      case "draw-two":
        return (
          <div className="flex items-center gap-1">
            <Plus className="w-8 h-8" />
            <span className="text-lg font-bold">2</span>
          </div>
        );
      case "wild":
        return (
          <div className="grid grid-cols-2 gap-1 w-12 h-12">
            <div className="rounded-sm bg-red-500" />
            <div className="rounded-sm bg-green-500" />
            <div className="rounded-sm bg-blue-500" />
            <div className="rounded-sm bg-yellow-400" />
          </div>
        );
      case "wild-draw-four":
        return (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 gap-0.5 w-10 h-10 mb-1">
              <div className="rounded-sm bg-red-500" />
              <div className="rounded-sm bg-green-500" />
              <div className="rounded-sm bg-blue-500" />
              <div className="rounded-sm bg-yellow-400" />
            </div>
            <div className="flex items-center gap-1">
              <Plus className="w-5 h-5" />
              <span className="text-md font-bold">4</span>
            </div>
          </div>
        );
      default:
        return <span className="text-3xl font-extrabold">{card.value}</span>;
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <button
        disabled={!isMyTurn || !canPlay}
        onClick={handlePlayCard}
        className={`w-20 h-28 rounded-2xl flex items-center justify-center 
                    text-white shadow-xl border-4 border-white
                    bg-gradient-to-br ${bgGradient}
                    transform transition-transform duration-200 ease-in-out
                    hover:scale-110 active:scale-95
                    ${!isMyTurn || !canPlay ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        <div className="drop-shadow-lg">{renderValue()}</div>
      </button>

      {/* Choose color overlay */}
      {choosing && (
        <div className="absolute top-full mt-3 flex gap-3">
          {(["red", "green", "blue", "yellow"] as const).map((c) => (
            <button
              key={c}
              onClick={() => handleChooseColor(c)}
              className={`w-7 h-7 rounded-full bg-gradient-to-br ${colors[c]} 
                          shadow-md hover:scale-110 transition-transform`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
