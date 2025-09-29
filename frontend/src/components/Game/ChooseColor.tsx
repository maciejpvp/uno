import type { Card } from "../../../../shared/types/types";

type ChooseColorProps = {
  onChoose: (color: "red" | "green" | "blue" | "yellow") => void;
  coords: { x: number; y: number };
  close: () => void;
};

const colors: Record<Card["color"], string> = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-400",
  black: "bg-gray-700",
};

const colorsHover: Record<Card["color"], string> = {
  red: "hover:bg-red-700",
  green: "hover:bg-green-700",
  blue: "hover:bg-blue-700",
  yellow: "hover:bg-yellow-600",
  black: "hover:bg-gray-900",
};

export const ChooseColor = ({ onChoose, coords, close }: ChooseColorProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/20" onClick={close} />

      <div
        className="absolute w-32 h-32 rounded-full grid grid-cols-2 grid-rows-2 overflow-hidden shadow-2xl z-10"
        style={{
          top: coords.y - 70,
          left: coords.x + 40,
          transform: "translate(-50%, -50%)",
        }}
      >
        <button
          onClick={() => onChoose("red")}
          className={`w-full h-full ${colors.red} ${colorsHover.red} transition-all duration-200`}
        />
        <button
          onClick={() => onChoose("green")}
          className={`w-full h-full ${colors.green} ${colorsHover.green} transition-all duration-200`}
        />
        <button
          onClick={() => onChoose("blue")}
          className={`w-full h-full ${colors.blue} ${colorsHover.blue} transition-all duration-200`}
        />
        <button
          onClick={() => onChoose("yellow")}
          className={`w-full h-full ${colors.yellow} ${colorsHover.yellow} transition-all duration-200`}
        />
      </div>
    </div>
  );
};
