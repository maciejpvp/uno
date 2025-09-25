import { useState, useRef, useEffect } from "react";

type CodeInputProps = {
  length?: number;
  callback?: (val: string) => void;
};

export default function CodeInput({ length = 6, callback }: CodeInputProps) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newValues = [...values];
      if (values[index]) {
        newValues[index] = "";
        setValues(newValues);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        newValues[index - 1] = "";
        setValues(newValues);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    if (values.every((v) => v !== "")) {
      callback?.(values.join(""));
    }
  }, [values, callback]);

  return (
    <div className="flex gap-2 justify-center">
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
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="
    w-12 h-12 
    text-center text-2xl font-semibold 
    rounded-xl
    bg-violet-900/40 border border-violet-600/40 
    text-violet-100 
    shadow-md shadow-black/40
    backdrop-blur-sm
    transition-all duration-200
    focus:outline-none 
    focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-violet-800
    focus:border-violet-300
    focus:shadow-[0_0_12px_3px_rgba(200,150,255,0.8)]
  "
        />
      ))}
    </div>
  );
}
