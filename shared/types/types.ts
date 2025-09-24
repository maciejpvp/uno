export type Color = "red" | "green" | "blue" | "yellow" | "black";

export type Value =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "skip"
  | "reverse"
  | "draw-two"
  | "wild"
  | "wild-draw-four";

export type Card = {
  color: Color;
  value: Value;
};

export type LobbyType = {
  id: string;
  status: "waiting" | "playing" | "finished";
  code: number;
  ownerId: string;
  players: PlayerType[];
  currentTurn: number; // Player Index
  direction: 1 | -1;
  drawPile: Card[];
  discardPile: Card[];
};

export type PlayerType = {
  id: string;
  username: string;
  hand: Card[];
};
