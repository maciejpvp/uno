import { AppServer, AppSocket } from "..";
import { createLobby, joinLobby, startLobby } from "../game/lobby";
import { createPlayer } from "../game/player";

export default function registerLobbyHandlers(
  io: AppServer,
  socket: AppSocket,
) {
  socket.on("createLobby", (callback) => {
    const player = createPlayer(socket);
    const lobby = createLobby({ player });

    // Join User to socket room
    socket.join(lobby.id);
    callback({ success: true, data: lobby });
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
