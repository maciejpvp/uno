import { Hand } from "../components/Game/Hand";
import { useGameStore } from "../store/gameStore";

export const GamePage = () => {
  const discardPile = useGameStore((store) => store.discardPile);
  const hand = useGameStore((store) => store.hand);

  const lastPileCard = discardPile.at(-1);

  if (lastPileCard === undefined) return null;

  return (
    <div className="flex flex-col items-center gap-6">
      <div>
        <p className="text-lg font-semibold">Discard Pile</p>
        {/* Show top card */}
        <div className="mt-2">
          {/* reuse same CardComponent */}
          <Hand cards={[lastPileCard]} />
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold">Your Hand</p>
        <Hand cards={hand} />
      </div>
    </div>
  );
};
