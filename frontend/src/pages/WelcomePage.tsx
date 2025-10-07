import { useRef } from "react";
import CodeInput, { type CodeInputHandle } from "../components/CodeInput";
import { CreateLobbyButton } from "../components/CreateLobbyButton";
import { useGameStore } from "../store/gameStore";
import { useSocketStore } from "../store/socketStore";

export const WelcomePage = () => {
  const socket = useSocketStore((store) => store.socket);
  const codeInputRef = useRef<CodeInputHandle>(null);

  const handleJoinLobby = (val: number) => {
    if (!socket?.active) return;

    socket.emit("joinLobby", val, (res) => {
      if (!res.success) {
        codeInputRef.current?.reset();
        return;
      }

      const lobby = res.data;

      const state = useGameStore.getState();

      state.setInGame(true);
      state.setCode(lobby.code);
      state.setOwnerId(lobby.ownerId);
      state.setPlayers(
        lobby.players.map((p) => ({
          id: p.id,
          username: p.username,
          cardCount: 7,
        })),
      );
      state.setStatus(lobby.status);
    });
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="flex flex-col gap-2 justify-center items-center">
        <label className="text-violet-300 text-sm font-medium">
          Enter Game Code
        </label>
        <CodeInput
          ref={codeInputRef}
          callback={(val) => handleJoinLobby(Number(val))}
        />
      </div>
      <CreateLobbyButton />
    </div>
  );
};
