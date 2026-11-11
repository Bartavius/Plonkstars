import type { RuleConfig } from "@/features/game/types/rule-config";

interface CheckboxInputProps {
  data: RuleConfig;
  setInput: (input: boolean) => void;
  value?: boolean;
  editable?: boolean;
}
function CheckboxInput({ data, setInput, value, editable = true }: CheckboxInputProps) {
  return (
    <div className="w-full relative flex flex-row gap-2">
      <label htmlFor={String(data.name)}>{data.name}:</label>
      <input
        type="checkbox"
        id={String(data.name)}
        checked={value}
        className="mr-2 cursor-pointer"
        onChange={(e) => setInput(e.target.checked)}
        disabled={!editable}
      />
    </div>
  );
}

export { CheckboxInput };
