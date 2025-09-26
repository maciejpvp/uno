import { useState } from "react";
import type { Card } from "../../../../shared/types/types";
import { useGameStore } from "../../store/gameStore";
import { useSocketStore } from "../../store/socketStore";

type CardComponentProps = {
  card: Card;
  isMyTurn: boolean;
};

export const CardComponent = ({ card, isMyTurn }: CardComponentProps) => {
  const [choosing, setChoosing] = useState(false);

  const colors: Record<Card["color"], string> = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-400",
    black: "bg-gray-800",
  };

  const socket = useSocketStore((store) => store.socket);

  const handlePlayCard = () => {
    if (!socket?.active) return;

    // If it's a wild, open choose-color mode
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

  const bgColor = isMyTurn ? colors[card.color] : "bg-black";

  return (
    <div className="relative">
      <button
        disabled={!isMyTurn}
        onClick={handlePlayCard}
        className={`w-16 h-24 rounded-lg flex items-center justify-center 
                    text-white font-bold shadow-lg border-2 border-white
                    ${bgColor}`}
      >
        {card.value}
      </button>

      {/* Choose color overlay */}
      {choosing && (
        <div className="absolute top-full mt-2 flex gap-2">
          {(["red", "green", "blue", "yellow"] as const).map((c) => (
            <button
              key={c}
              onClick={() => handleChooseColor(c)}
              className={`w-6 h-6 rounded-full ${colors[c]}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
