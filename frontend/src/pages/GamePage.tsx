import { useEffect, useRef, useState } from "react";
import { Hand } from "../components/Game/Hand";
import { useGameStore } from "../store/gameStore";
import { useSocketStore } from "../store/socketStore";
import type { ServerToClientEvents } from "../../../shared/types/socket";
import { CardComponent } from "../components/Game/CardComponent";
import { BackHand } from "../components/Game/BackHand";
import { GameOverModal } from "../components/Game/GameOverModal";
import { DrawCardButton } from "../components/Game/DrawCardButton";
import { isMobile } from "react-device-detect";

export const GamePage = () => {
  const discardPile = useGameStore((store) => store.discardPile);
  const hand = useGameStore((store) => store.hand);
  const players = useGameStore((store) => store.players);
  const currentTurn = useGameStore((store) => store.currentTurn);
  const socket = useSocketStore((store) => store.socket);
  const status = useGameStore((store) => store.status);
  const winner = useGameStore((store) => store.winner);
  const drawCardCooldownRef = useRef<boolean>(false);

  const lastPileCard = discardPile.at(-1);

  const [discardPileOffset, setDiscardPileOffset] = useState(0);

  useEffect(() => {
    if (!socket?.active) return;

    const handleCardPlayed: ServerToClientEvents["cardPlayed"] = (data) => {
      const state = useGameStore.getState();

      state.setDiscardPile([...state.discardPile, data.card]);
      state.setCurrentTurn(data.currentTurn);
      state.setHand(data.hand);

      const updatedPlayers = data.players.map((p) => {
        const existing = state.players.find((pl) => pl.id === p.id);
        return {
          id: p.id,
          username: existing?.username ?? "Unknown",
          cardCount: p.handCount,
        };
      });

      state.setPlayers(updatedPlayers);
    };

    const handleCardDrawn: ServerToClientEvents["cardDrawn"] = (data) => {
      const state = useGameStore.getState();
      state.setHand(data.hand);
    };

    const handleGameOver: ServerToClientEvents["gameOver"] = (data) => {
      const { winner } = data;
      const state = useGameStore.getState();

      state.setStatus("finished");
      const winnerPlayer = state.players.find((p) => p.id === winner);
      const username = winnerPlayer?.username;
      state.setWinner(username);
    };

    const handleResetGame = () => {
      useGameStore.getState().resetGame();
    };

    socket.on("cardPlayed", handleCardPlayed);
    socket.on("cardDrawn", handleCardDrawn);
    socket.on("gameOver", handleGameOver);
    socket.on("lobbyReset", handleResetGame);

    return () => {
      socket.off("cardPlayed", handleCardPlayed);
      socket.off("cardDrawn", handleCardDrawn);
      socket.off("gameOver", handleGameOver);
      socket.off("lobbyReset", handleResetGame);
    };
  }, [socket]);

  const handleDrawCard = () => {
    if (drawCardCooldownRef.current) return;

    socket?.emit("drawCard", { code: useGameStore.getState().code });
    drawCardCooldownRef.current = true;
    setTimeout(() => {
      drawCardCooldownRef.current = false;
    }, 300);
  };

  const handlePlayAgain = () => {
    socket?.emit("resetLobby", { code: useGameStore.getState().code });
  };

  if (!lastPileCard) return null;

  const myId = socket?.id;
  const meIndex = players.findIndex((p) => p.id === myId);

  const rotatedPlayers =
    meIndex === -1
      ? players
      : [...players.slice(meIndex), ...players.slice(0, meIndex)];

  const right = rotatedPlayers[1];
  const top = rotatedPlayers[2];
  const left = rotatedPlayers[3];

  const isMyTurn = players[currentTurn]?.id === myId;

  return (
    <>
      {isMyTurn && !isMobile && <DrawCardButton onClick={handleDrawCard} />}
      <div className="relative w-full h-screen flex flex-col items-center justify-between p-6">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center flex flex-col gap-2`}
          style={{
            transform: `translate(-50%, calc(-50% - ${discardPileOffset}px))`,
          }}
        >
          <CardComponent
            card={lastPileCard}
            size={isMobile ? "sm" : "lg"}
            top={isMobile ? -30 : -110}
            left={isMobile ? -28 : -56}
          />
          {isMyTurn && isMobile && (
            <button
              className="bg-purple-950 text-purple-100 p-2 rounded-md absolute text-nowrap top-15 w-26 active:scale-110 transition-transform"
              onClick={handleDrawCard}
            >
              Draw Card
            </button>
          )}
        </div>

        {!isMobile && (
          <>
            {top && (
              <div className="w-auto">
                <BackHand
                  username={top.username}
                  cardCount={top.cardCount}
                  highlight={players[currentTurn]?.id === top.id}
                  orientation="top"
                />
              </div>
            )}

            <div className="flex flex-1 w-full items-center justify-between">
              {left && (
                <BackHand
                  username={left.username}
                  cardCount={left.cardCount}
                  highlight={players[currentTurn]?.id === left.id}
                  orientation="left"
                />
              )}

              {right && (
                <BackHand
                  username={right.username}
                  cardCount={right.cardCount}
                  highlight={players[currentTurn]?.id === right.id}
                  orientation="right"
                />
              )}
            </div>
          </>
        )}

        {isMobile && (
          <div className="absolute">
            {players.map((p) => {
              if (p.id === socket?.id) return null;
              return (
                <div className="bg-purple-700 text-purple-100 p-2 rounded-md">
                  {p.username} {p.cardCount}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col items-center">
          <p
            className={`text-lg font-semibold
               text-yellow-400 animate-pulse absolute top-2`}
          >
            {isMyTurn ? "Your Turn" : ""}
          </p>
          <Hand cards={hand} setDiscardPileOffset={setDiscardPileOffset} />
        </div>
        {status === "finished" && (
          <GameOverModal
            winner={winner ? winner : ""}
            onClose={handlePlayAgain}
          />
        )}
      </div>
    </>
  );
};
