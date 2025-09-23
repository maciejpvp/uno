import { Server, Socket } from "socket.io";
import { LobbyType, PlayerType } from "../types";

export interface ServerToClientEvents {
  lobbyStart: () => void;
  playerJoined: (player: PlayerType) => void;
}

export interface ClientToServerEvents {
  createLobby: () => void;
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

export type AppServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
