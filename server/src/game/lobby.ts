import { v4 as uuidv4 } from "uuid";
import { createCards } from "./createCards";
import { games } from "./state";
import { createPlayer } from "./player";
import { LobbyType, PlayerType } from "../../../shared/types/types";
import { AppServer, AppSocket } from "..";

export const createLobby = ({ player }: { player: PlayerType }): LobbyType => {
  const code = 123456;

  const id = uuidv4();

  const lobby: LobbyType = {
    id,
    status: "waiting",
    code,
    ownerId: player.id,
    players: [player],
    currentTurn: 0,
    direction: 1,
    drawPile: [],
    discardPile: [],
  };

  games.set(lobby.code, lobby);

  return lobby;
};

export const joinLobby = ({
  code,
  socket,
  io,
}: {
  code: number;
  socket: AppSocket;
  io: AppServer;
}) => {
  const lobby = games.get(code);

  if (!lobby) return "Invalid Code";

  const player = createPlayer(socket);

  // Prevent duplicate players
  if (lobby.players.find((p) => p.id === player.id)) {
    return "Player already in lobby";
  }

  io.to(lobby.id).emit("playerJoined", player);

  // Add player
  lobby.players.push(player);

  // Update lobby in map
  games.set(code, lobby);

  return lobby;
};

export const startLobby = ({
  code,
  playerId,
  io,
}: {
  code: number;
  playerId: string;
  io: AppServer;
}) => {
  const lobby = games.get(code);

  if (!lobby) return;

  if (lobby.ownerId !== playerId) return;

  const { drawPile, updatedPlayers } = createCards(lobby.players);

  lobby.players = updatedPlayers;
  lobby.drawPile = drawPile;
  lobby.discardPile = [drawPile.pop()!];

  lobby.status = "playing";

  for (const player of lobby.players) {
    io.to(player.id).emit("lobbyStart", {
      hand: player.hand,
      pile: lobby.discardPile.at(-1)!,
      currentTurn: lobby.currentTurn,
    });
  }
};
