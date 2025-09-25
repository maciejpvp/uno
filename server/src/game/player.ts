import { AppSocket } from "..";
import { PlayerType } from "../../../shared/types/types";

const commonNames = [
  "Josh",
  "Emily",
  "Michael",
  "Jessica",
  "Daniel",
  "Ashley",
  "Matthew",
  "Sarah",
  "David",
  "Amanda",
  "James",
  "Jennifer",
  "John",
  "Elizabeth",
  "Ryan",
  "Samantha",
  "Andrew",
  "Lauren",
  "Justin",
  "Megan",
  "Brandon",
  "Nicole",
  "Joseph",
  "Stephanie",
  "Anthony",
  "Rachel",
  "Kyle",
  "Amber",
  "Alexander",
  "Heather",
];

const getRandomName = () => {
  const index = Math.floor(Math.random() * commonNames.length);
  return commonNames[index];
};

export const createPlayer = (socket: AppSocket): PlayerType => {
  const player: PlayerType = {
    id: socket.id,
    username: getRandomName(),
    hand: [],
  };

  return player;
};
