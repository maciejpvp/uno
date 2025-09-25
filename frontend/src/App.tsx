import { useEffect } from "react";
import { useSocketStore } from "./store/socketStore";
import CodeInput from "./components/CodeInput";

export const App = () => {
  const socket = useSocketStore((store) => store.socket);
  const connect = useSocketStore((store) => store.connect);
  const disconnect = useSocketStore((store) => store.disconnect);

  useEffect(() => {
    if (socket?.connected) return;

    connect();

    return () => {
      disconnect();
    };
    //eslint-disable-next-line
  }, []);

  const handleCreateLobby = () => {
    if (!socket?.active) return;

    socket.emit("createLobby", (res) => {
      console.log(res);
    });
  };

  const handleJoinLobby = (val: number) => {
    if (!socket?.active) return;

    socket.emit("joinLobby", val, (res) => {
      console.log(res);
    });
  };

  return (
    <div className="bg-violet-900 w-screen h-screen flex justify-center items-center relative">
      <div className="flex flex-col gap-6 items-center w-full max-w-sm">
        <div className="flex flex-col gap-2 items-center">
          <label className="text-violet-300 text-sm font-medium">
            Enter Game Code
          </label>
          <CodeInput callback={(val) => handleJoinLobby(Number(val))} />
        </div>

        <button
          onClick={handleCreateLobby}
          className="
        text-violet-100 text-sm font-medium
        px-5 py-2.5 rounded-lg
        border border-violet-400/40
        hover:border-violet-300 hover:bg-violet-800/40
        transition-colors
      "
        >
          Create a new game
        </button>
      </div>
    </div>
  );
};
