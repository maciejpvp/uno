import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

type CodeInputProps = {
  length?: number;
  callback?: (val: string) => void;
};

export type CodeInputHandle = {
  reset: () => void;
};

const CodeInput = forwardRef<CodeInputHandle, CodeInputProps>(
  ({ length = 6, callback }, ref) => {
    const [values, setValues] = useState<string[]>(Array(length).fill(""));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleChange = (
      index: number,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const val = e.target.value.replace(/\D/g, "");
      if (!val) return;
      const newValues = [...values];
      newValues[index] = val[0];
      setValues(newValues);
      if (index < length - 1) {
        setTimeout(() => {
          inputsRef.current[index + 1]?.focus();
        }, 1);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
      if (!pasted) return;
      const newValues = Array(length)
        .fill("")
        .map((_, i) => pasted[i] ?? "");
      setValues(newValues.slice(0, length));
    };

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        const newValues = [...values];
        if (values[index]) newValues[index] = "";
        else if (index > 0) {
          newValues[index - 1] = "";
          inputsRef.current[index - 1]?.focus();
        }
        setValues(newValues);
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputsRef.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        inputsRef.current[index + 1]?.focus();
      }
    };

    const handleFocus = (index: number) => {
      if (index === 0) return;
      const oneBefore = values[index - 1];
      if (!oneBefore) {
        inputsRef.current[index - 1]?.focus();
      }
    };

    useEffect(() => {
      if (values.every((v) => v !== "")) callback?.(values.join(""));
    }, [values, callback]);

    const reset = () => {
      setValues(Array(length).fill(""));
      if (containerRef.current) {
        containerRef.current.classList.add("wiggle");
        setTimeout(() => containerRef.current?.classList.remove("wiggle"), 300);
      }
      inputsRef.current[0]?.focus();
    };

    useImperativeHandle(ref, () => ({ reset }));

    return (
      <div ref={containerRef} className="flex gap-2 justify-center">
        {values.map((val, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val}
            onFocus={() => handleFocus(i)}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="
            w-12 h-12 text-center text-2xl font-semibold rounded-xl
            bg-violet-900/40 border border-violet-600/40 text-violet-100
            shadow-md shadow-black/40 backdrop-blur-sm
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-violet-800
            focus:border-violet-300 focus:shadow-[0_0_12px_3px_rgba(200,150,255,0.8)]
          "
          />
        ))}
        <style>{`
        .wiggle {
          animation: wiggle 0.3s ease-in-out;
        }
        @keyframes wiggle {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}</style>
      </div>
    );
  },
);

export default CodeInput;
