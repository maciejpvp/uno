import { Card, LobbyType, PlayerType, Color } from "./types";

export interface ServerToClientEvents {
  lobbyStart: (data: { hand: Card[]; pile: Card; currentTurn: number }) => void;
  playerJoined: (player: PlayerType) => void;
  cardPlayed: (data: {
    playerId: string;
    card: Card;
    currentTurn: number;
    discardPile: Card[];
    players: { id: string; handCount: number }[];
  }) => void;
  gameOver: (data: { winner: string }) => void;
}

export interface ClientToServerEvents {
  createLobby: (
    callback: (
      res:
        | { success: true; data: LobbyType }
        | { success: false; message: string },
    ) => void,
  ) => void;
  joinLobby: (
    code: number,
    callback: (
      res:
        | { success: true; data: LobbyType }
        | { success: false; message: string },
    ) => void,
  ) => void;
  startLobby: (code: number) => void;
  playCard: (data: { code: number; card: Card; chosenColor?: Color }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId?: string;
}
