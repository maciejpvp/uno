import { AppServer, AppSocket } from "..";
import {
  createLobby,
  joinLobby,
  playerLeave,
  resetLobby,
  startLobby,
} from "../game/lobby";
import { createPlayer } from "../game/player";

export default function registerLobbyHandlers(
  io: AppServer,
  socket: AppSocket,
) {
  socket.on("createLobby", (callback) => {
    const player = createPlayer(socket);
    const lobby = createLobby({ player });

    socket.data.lobbyId = lobby.code;

    // Join User to socket room
    socket.join(lobby.id);
    callback({ success: true, data: lobby });
  });

  socket.on("joinLobby", (code, callback) => {
    const lobby = joinLobby({ code, socket, io });

    if (typeof lobby === "string") {
      callback({ success: false, message: lobby });
    } else {
      socket.data.lobbyId = lobby.code;
      callback({ success: true, data: lobby });
    }
  });

  socket.on("startLobby", (code) => {
    startLobby({ code, playerId: socket.id, io });
  });

  socket.on("resetLobby", (data) => {
    const { code } = data;
    resetLobby({ code, socket, io });
  });

  socket.on("leaveLobby", (data) => {
    const { code } = data;

    playerLeave({ code, playerId: socket.id, socket, io });
  });
}
