import { AppServer, AppSocket } from "..";
import { playCard } from "../game/gameplay";

export default function registerGameHandlers(io: AppServer, socket: AppSocket) {
  socket.on("playCard", (data) => playCard({ data, socket, io }));
}
