import { AppSocket } from "..";
import { PlayerType } from "../../../shared/types/types";

export const createPlayer = (socket: AppSocket): PlayerType => {
  const player: PlayerType = {
    id: socket.id,
    username: "Placeholder",
    hand: [],
  };

  return player;
};
