import { create } from "zustand";
import type { Card } from "../../../shared/types/types";

type GameState = {
  inGame: boolean;
  status: "waiting" | "playing" | "finished";
  winner: string | undefined;
  code: number;
  ownerId: string;
  players: { id: string; username: string; cardCount: number }[];
  currentTurn: number; // Player Index
  direction: 1 | -1;
  discardPile: Card[];
  hand: Card[];

  // Setters
  setInGame: (val: boolean) => void;
  setStatus: (val: "waiting" | "playing" | "finished") => void;
  setWinner: (val: string | undefined) => void;
  setCode: (val: number) => void;
  setOwnerId: (val: string) => void;
  setPlayers: (
    val: { id: string; username: string; cardCount: number }[],
  ) => void;
  setCurrentTurn: (val: number) => void;
  setDirection: (val: 1 | -1) => void;
  setDiscardPile: (val: Card[]) => void;
  setHand: (val: Card[]) => void;

  // Reset
  resetGame: () => void;
  leaveLobby: () => void;
};

const initialState = {
  inGame: false,
  status: "waiting" as const,
  winner: undefined,
  code: 0,
  ownerId: "",
  players: [] as { id: string; username: string; cardCount: number }[],
  currentTurn: 0,
  direction: 1 as 1 | -1,
  discardPile: [] as Card[],
  hand: [] as Card[],
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  // Setters
  setInGame: (val) => set({ inGame: val }),
  setStatus: (val) => set({ status: val }),
  setWinner: (val) => set({ winner: val }),
  setCode: (val) => set({ code: val }),
  setOwnerId: (val) => set({ ownerId: val }),
  setPlayers: (val) => set({ players: val }),
  setCurrentTurn: (val) => set({ currentTurn: val }),
  setDirection: (val) => set({ direction: val }),
  setDiscardPile: (val) => set({ discardPile: val }),
  setHand: (val) => set({ hand: val }),

  // Reset
  resetGame: () =>
    set({
      status: "waiting",
      setWinner: undefined,
      currentTurn: 0,
      direction: 1,
      discardPile: [],
      hand: [],
    }),

  leaveLobby: () => {
    set(initialState);
  },
}));
