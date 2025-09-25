import CodeInput from "../components/CodeInput";
import { CreateLobbyButton } from "../components/CreateLobbyButton";
import { useSocketStore } from "../store/socketStore";

export const WelcomePage = () => {
  const socket = useSocketStore((store) => store.socket);

  const handleJoinLobby = (val: number) => {
    if (!socket?.active) return;

    socket.emit("joinLobby", val, (res) => {
      console.log(res);
    });
  };

  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="flex flex-col gap-2 justify-center items-center">
        <label className="text-violet-300 text-sm font-medium">
          Enter Game Code
        </label>
        <CodeInput callback={(val) => handleJoinLobby(Number(val))} />
      </div>
      <CreateLobbyButton />
    </div>
  );
};
