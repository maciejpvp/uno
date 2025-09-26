import type { Card } from "../../../../shared/types/types";

type CardComponentProps = {
  card: Card;
};

export const CardComponent = ({ card }: CardComponentProps) => {
  const colors: Record<Card["color"], string> = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-400",
    black: "bg-gray-800",
  };

  return (
    <div
      className={`w-16 h-24 rounded-lg flex items-center justify-center 
                  text-white font-bold shadow-lg border-2 border-white
                  ${colors[card.color]}`}
    >
      {card.value}
    </div>
  );
};
