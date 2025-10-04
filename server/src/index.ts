import { createServer } from "http";
import os from "os";
import express from "express";
import registerLobbyHandlers from "./sockets/lobby";
import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "../../shared/types/socket";
import registerGameHandlers from "./sockets/game";
import { playerLeave } from "./game/lobby";

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
  registerGameHandlers(io, socket);

  socket.on("disconnect", (reason) => {
    if (socket.data.lobbyId) {
      playerLeave({
        code: socket.data.lobbyId,
        playerId: socket.id,
        socket,
        io,
      });
    }

    console.log(`❌ Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen({ port: PORT, host: "0.0.0.0" }, () => {
  console.log(`🚀 Server listening on:`);
  console.log(`→ Local:    http://localhost:${PORT}`);

  const interfaces = os.networkInterfaces();
  for (const netList of Object.values(interfaces)) {
    if (!netList) continue;

    for (const net of netList) {
      if (net.family === "IPv4" && !net.internal) {
        console.log(`→ Network: http://${net.address}:${PORT}`);
      }
    }
  }
});
