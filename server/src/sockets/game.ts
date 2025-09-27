import { AppServer, AppSocket } from "..";
import { drawCard, playCard } from "../game/gameplay";

export default function registerGameHandlers(io: AppServer, socket: AppSocket) {
  socket.on("playCard", (data) => playCard({ data, socket, io }));

  socket.on("drawCard", (data) => drawCard({ code: data.code, socket, io }));
}
