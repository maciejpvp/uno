import { useEffect } from "react";
import { useSocketStore } from "./store/socketStore";

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

  return (
    <>
      <button onClick={handleCreateLobby}>Create Lobby</button>
      <p>123</p>
    </>
  );
};
