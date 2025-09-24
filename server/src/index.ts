import { createServer } from "http";
import express from "express";
import registerLobbyHandlers from "./sockets/lobby";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../shared/types/socket";

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

const app = express();
const httpServer = createServer(app);

const io: AppServer = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket: AppSocket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  registerLobbyHandlers(io, socket);
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
