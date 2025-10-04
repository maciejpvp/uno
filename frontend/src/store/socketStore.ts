import { create } from "zustand";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../../../shared/types/socket";

export type AppSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents
> | null;

type SocketStore = {
  socket: AppSocket;
  connect: () => void;
  disconnect: () => void;
};

let socketInstance: AppSocket = null; // singleton

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,

  connect: () => {
    if (socketInstance) {
      set({ socket: socketInstance });
      return;
    }

    const socket = io(
      `${import.meta.env.VITE_BACKEND || "http://192.168.1.102:3000"}`,
    );

    socket.on("connect", () => {
      console.log("🔌 Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    // socket.onAny((event, ...args) => {
    //   console.log(`📥 Received event: "${event}"`, ...args);
    // });

    socketInstance = socket;
    set({ socket });
  },

  disconnect: () => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
      set({ socket: null });
    }
  },
}));
