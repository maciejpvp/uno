import { AppServer, AppSocket } from "..";
import { ClientToServerEvents } from "../../../shared/types/socket";
import { Card, LobbyType, PlayerType } from "../../../shared/types/types";
import { games } from "./state";

const isPlayerTurn = (data: { lobby: LobbyType; id: string }): boolean => {
  const currentPlayer = data.lobby.players[data.lobby.currentTurn];

  const result = currentPlayer.id === data.id;
  return result;
};

const getNextTurn = (lobby: LobbyType, steps: number) => {
  const { players, currentTurn, direction } = lobby;
  return (currentTurn + steps * direction + players.length) % players.length;
};

const drawCards = (player: PlayerType, drawPile: Card[], count: number) => {
  for (let i = 0; i < count; i++) {
    if (drawPile.length === 0) break;
    player.hand.push(drawPile.pop()!);
  }
};

export const playCard = (data: {
  data: Parameters<ClientToServerEvents["playCard"]>[0];
  socket: AppSocket;
  io: AppServer;
}) => {
  const lobby = games.get(data.data.code);

  if (!lobby) return;
  const io = data.io;

  // ✅ Check if it's his move turn
  const isHisTurn = isPlayerTurn({ lobby, id: data.socket.id });
  if (!isHisTurn) return;

  const player = lobby.players[lobby.currentTurn];

  const cardIndex = player.hand.findIndex(
    (c) => c.color === data.data.card.color && c.value === data.data.card.value,
  );

  // ✅ Player must actually have the card
  if (cardIndex === -1) return;

  const topCard = lobby.discardPile.at(-1);

  // ✅ Check if the card is playable
  const canPlay =
    data.data.card.color === topCard?.color ||
    data.data.card.value === topCard?.value ||
    data.data.card.value === "wild" ||
    data.data.card.value === "wild-draw-four";

  console.log(canPlay);

  if (!canPlay) return;

  // ✅ Remove card from player's hand & push to discard pile
  const [playedCard] = player.hand.splice(cardIndex, 1);
  lobby.discardPile.push(playedCard);

  // ✅ Handle special effects
  switch (playedCard.value) {
    case "reverse":
      lobby.direction *= -1;
      break;
    case "skip":
      lobby.currentTurn = getNextTurn(lobby, 2); // skip one extra
      break;
    case "draw-two": {
      const next = getNextTurn(lobby, 1);
      const nextPlayer = lobby.players[next];
      drawCards(nextPlayer, lobby.drawPile, 2);
      lobby.currentTurn = getNextTurn(lobby, 2);
      break;
    }
    case "wild":
      // ✅ Player should have chosen a color in data.data.chosenColor
      playedCard.color = data.data.chosenColor ?? playedCard.color;
      lobby.currentTurn = getNextTurn(lobby, 1);
      break;
    case "wild-draw-four": {
      playedCard.color = data.data.chosenColor ?? playedCard.color;
      const next = getNextTurn(lobby, 1);
      const nextPlayer = lobby.players[next];
      drawCards(nextPlayer, lobby.drawPile, 4);
      lobby.currentTurn = getNextTurn(lobby, 2);
      break;
    }
    default:
      lobby.currentTurn = getNextTurn(lobby, 1);
  }

  // ✅ Check win condition
  if (player.hand.length === 0) {
    io.to(lobby.id).emit("gameOver", { winner: player.id });
    games.delete(lobby.code);
    return;
  }

  // ✅ Broadcast state update
  console.log("Dd");
  io.to(lobby.id).emit("cardPlayed", {
    playerId: player.id,
    card: playedCard,
    currentTurn: lobby.currentTurn,
    discardPile: lobby.discardPile,
    players: lobby.players.map((p) => ({
      id: p.id,
      handCount: p.hand.length,
    })),
  });
};
