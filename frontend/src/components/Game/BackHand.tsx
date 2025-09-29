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
    <div className="flex flex-col items-center justify-center relative max-h-[50dvh]">
      <p className="mb-1 text-violet-50">{username}</p>
      <div
        className={`relative flex items-center justify-center  ${isVertical ? "translate-y-12" : "translate-x-12"}`}
        style={{
          width: isVertical ? 60 : cardCount * overlap + 60,
          height: isVertical ? cardCount * overlap + 100 : 100,
        }}
      >
        {Array.from({ length: cardCount }).map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: isVertical ? i * overlap : "50%",
              left: isVertical ? "50%" : i * overlap,
              transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
              zIndex: i,
            }}
          >
            <BackCard highlight={highlight} />
          </div>
        ))}
      </div>
    </div>
  );
};
