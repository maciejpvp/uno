import {
  createLobby,
  createPlayer,
  joinLobby,
  startLobby,
} from "../game/state";
import { AppServer, AppSocket } from "../types/socket";

export default function registerLobbyHandlers(
  io: AppServer,
  socket: AppSocket,
) {
  socket.on("createLobby", () => {
    const player = createPlayer(socket);
    const lobby = createLobby({ player });

    // Join User to socket room
    socket.join(lobby.id);
  });

  socket.on("joinLobby", (code, callback) => {
    const lobby = joinLobby({ code, socket, io });

    if (typeof lobby === "string") {
      callback({ success: false, message: lobby });
    } else {
      callback({ success: true, data: lobby });
    }
  });

  socket.on("startLobby", (code) => {
    startLobby({ code, playerId: socket.id, io });
  });
}
