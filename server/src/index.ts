import { createServer } from "http";
import express from "express";
import registerLobbyHandlers from "./sockets/lobby";
import registerGameHandlers from "./sockets/game";
import { AppServer, AppSocket } from "./types/socket";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io: AppServer = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket: AppSocket) => {
  console.log(`⚡ Client connected: ${socket.id}`);

  registerLobbyHandlers(io, socket);
  registerGameHandlers(io, socket);
});
