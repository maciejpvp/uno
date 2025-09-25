import { create } from "zustand";
import type { Card } from "../../../shared/types/types";

type GameState = {
  inGame: boolean;
  status: "waiting" | "playing" | "finished";
  code: number;
  ownerId: string;
  players: { id: string; username: string }[];
  currentTurn: number; // Player Index
  direction: 1 | -1;
  discardPile: Card[];
  hand: Card[];

  // Setters
  setInGame: (val: boolean) => void;
  setStatus: (val: "waiting" | "playing" | "finished") => void;
  setCode: (val: number) => void;
  setOwnerId: (val: string) => void;
  setPlayers: (val: { id: string; username: string }[]) => void;
  setCurrentTurn: (val: number) => void;
  setDirection: (val: 1 | -1) => void;
  setDiscardPile: (val: Card[]) => void;
  setHand: (val: Card[]) => void;
};

export const useGameStore = create<GameState>((set) => ({
  inGame: false,
  status: "waiting",
  code: 0,
  ownerId: "",
  players: [],
  currentTurn: 0,
  direction: 1,
  discardPile: [],
  hand: [],

  // Setters
  setInGame: (val) => set({ inGame: val }),
  setStatus: (val) => set({ status: val }),
  setCode: (val) => set({ code: val }),
  setOwnerId: (val) => set({ ownerId: val }),
  setPlayers: (val) => set({ players: val }),
  setCurrentTurn: (val) => set({ currentTurn: val }),
  setDirection: (val) => set({ direction: val }),
  setDiscardPile: (val) => set({ discardPile: val }),
  setHand: (val) => set({ hand: val }),
}));
