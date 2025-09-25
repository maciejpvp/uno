import { create } from "zustand";
import type { Card } from "../../../shared/types/types";

type GameState = {
  inGame: boolean;
  status: "waiting" | "playing" | "finished";
  code: number;
  ownerId: string;
  players: string[];
  currentTurn: number; // Player Index
  direction: 1 | -1;
  discardPile: Card[];
  hand: Card[];
};

export const useGameStore = create<GameState>(() => ({
  inGame: false,
  status: "waiting",
  code: 0,
  ownerId: "",
  players: [],
  currentTurn: 0,
  direction: 1,
  discardPile: [],
  hand: [],
}));
