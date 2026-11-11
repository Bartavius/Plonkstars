import { useEffect, useState } from "react";

import type { RuleConfig } from "@/features/game/types/rule-config";

interface TextInputProps {
  data: RuleConfig;
  setInput: (input: string | number) => void;
  value?: string | number;
  editable?: boolean;
}

function TextInput({ data, setInput, value, editable = true }: TextInputProps) {
  const [input, setInputState] = useState<string | number>(value || "");

  useEffect(() => {
    if (value !== undefined) {
      setInputState(value);
    }
  }, [value]);

  return (
    <div className="w-full relative flex flex-row gap-2">
      <label className="block text-white" htmlFor={String(data.name)}>
        {data.name}:
      </label>
      <input
        type={data.type === "integer" ? "number" : "text"}
        id={String(data.name)}
        className="bg-dark text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={input === -1 ? "" : input}
        onChange={(e) => setInputState(e.target.value)}
        onBlur={() => setInput(input)}
        readOnly={!editable}
      />
    </div>
  );
}

export { TextInput };
