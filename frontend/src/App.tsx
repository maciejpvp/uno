import { useEffect } from "react";
import { useSocketStore } from "./store/socketStore";
import CodeInput from "./components/CodeInput";
import { GameBackground } from "./components/Background";
import { CreateLobbyButton } from "./components/CreateLobbyButton";

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

  const handleJoinLobby = (val: number) => {
    if (!socket?.active) return;

    socket.emit("joinLobby", val, (res) => {
      console.log(res);
    });
  };

  return (
    <div>
      <GameBackground />
      <div className="w-screen h-screen flex justify-center items-center relative">
        <div className="flex flex-col gap-5 items-center">
          <div className="flex flex-col gap-2 justify-center items-center">
            <label className="text-violet-300 text-sm font-medium">
              Enter Game Code
            </label>
            <CodeInput callback={(val) => handleJoinLobby(Number(val))} />
          </div>
          <CreateLobbyButton />
        </div>
      </div>
    </div>
  );
};
