import { v4 as uuidv4 } from "uuid";
import { createCards } from "./createCards";
import { games } from "./state";
import { createPlayer } from "./player";
import { LobbyType, PlayerType } from "../../../shared/types/types";
import { AppServer, AppSocket } from "..";

const generateLobbyCode = (): number => {
  let lobbyId: number;

  do {
    lobbyId = Math.floor(100000 + Math.random() * 900000);
  } while (games.has(lobbyId));

  return lobbyId;
};

export const createLobby = ({ player }: { player: PlayerType }): LobbyType => {
  const code = generateLobbyCode();

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

  socket.join(lobby.id);

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

  if (lobby.status === "playing") return;

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

export const resetLobby = ({
  code,
  io,
  socket,
}: {
  code: number;
  io: AppServer;
  socket: AppSocket;
}) => {
  const lobby = games.get(code);
  console.log(lobby);

  if (!lobby) return;

  const ownerId = lobby.ownerId;
  if (ownerId !== socket.id) return;

  console.log("good");

  lobby.currentTurn = 0;
  lobby.direction = 1;
  lobby.drawPile = [];
  lobby.discardPile = [];
  lobby.status = "waiting";

  const { drawPile, updatedPlayers } = createCards(lobby.players);

  lobby.players = updatedPlayers;
  lobby.drawPile = drawPile;
  lobby.discardPile = [drawPile.pop()!];

  for (const player of lobby.players) {
    console.log(`${player.id} sent`);
    io.to(player.id).emit("lobbyReset", {
      hand: player.hand,
      pile: lobby.discardPile.at(-1)!,
      currentTurn: lobby.currentTurn,
    });
  }

  games.set(code, lobby);

  return lobby;
};

export const playerLeave = ({
  code,
  playerId,
  socket,
  io,
}: {
  code: number;
  playerId: string;
  socket: AppSocket;
  io: AppServer;
}) => {
  const lobby = games.get(code);
  if (!lobby) return;

  lobby.players = lobby.players.filter((p) => p.id !== playerId);

  if (lobby.players.length === 0) {
    games.delete(code);
    return;
  }

  // If owner left → reassign
  if (lobby.ownerId === playerId) {
    lobby.ownerId = lobby.players[0].id;
  }

  socket.leave(lobby.id);

  io.to(lobby.id).emit("playerLeft", { playerId, players: lobby.players });

  games.set(code, lobby);

  return lobby;
};
