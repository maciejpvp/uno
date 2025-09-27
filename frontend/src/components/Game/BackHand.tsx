import { BackCard } from "./BackCard";

type BackHandProps = {
  username: string;
  cardCount: number;
  highlight?: boolean;
  orientation?: "top" | "left" | "right";
};

export const BackHand = ({
  username,
  cardCount,
  highlight,
  orientation = "top",
}: BackHandProps) => {
  const isVertical = orientation === "left" || orientation === "right";

  const overlap = 24;

  const rotate = isVertical ? (orientation === "left" ? -90 : 90) : 0;

  return (
    <div className="flex flex-col items-center relative">
      <p className="mb-1 text-violet-50">{username}</p>
      <div
        className={`relative ${isVertical ? "h-[200px]" : "w-[300px]"} `}
        style={{
          width: isVertical ? "60px" : "auto",
          height: isVertical ? "auto" : "100px",
        }}
      >
        {Array.from({ length: cardCount }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: isVertical ? i * overlap : 0,
              left: isVertical ? 0 : i * overlap,
              zIndex: i,
              transform: `rotate(${rotate}deg)`,
            }}
          >
            <BackCard highlight={highlight} />
          </div>
        ))}
      </div>
    </div>
  );
};
