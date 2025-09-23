import { Server, Socket } from "socket.io";
import { playCard, startGame } from "../game/state";

export default function registerGameHandlers(io: Server, socket: Socket) {
  socket.on("startGame", (roomId: string) => {
    const gameState = startGame(roomId);
    io.to(roomId).emit("gameStarted", gameState);
  });
}
