import { Card, LobbyType, PlayerType } from "./types";

export interface ServerToClientEvents {
  lobbyStart: (data: { hand: Card[]; pile: Card; currentTurn: number }) => void;
  playerJoined: (player: PlayerType) => void;
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
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId?: string;
}
