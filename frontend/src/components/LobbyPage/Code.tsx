type CodeProps = {
  code: number;
};

export const Code = ({ code }: CodeProps) => {
  const codeStr = code.toString();
  const firstPart = codeStr.slice(0, 3);
  const secondPart = codeStr.slice(3, 6);

  return (
    <div
      className="relative flex justify-center items-center rounded-xl 
                  ring-2 ring-violet-400 px-4 py-2 overflow-hidden"
    >
      {/* Blurred background */}
      <div className="absolute inset-0 bg-violet-900/10 backdrop-blur-xl rounded-xl"></div>

      {/* Text on top */}
      <div className="relative text-8xl font-semibold text-violet-100">
        {firstPart}-{secondPart}
      </div>
    </div>
  );
};
