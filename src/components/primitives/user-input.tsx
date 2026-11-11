import type { RuleConfig } from "@/features/game/types/rule-config";
import type { RuleInputValue } from "@/features/game/types/rule-input-value";

import { CheckboxInput } from "./checkbox-input";
import { SliderInput } from "./slider-input";
import { TextInput } from "./text-input";

interface UserInputProps {
  inputType: RuleConfig["display"];
  data: RuleConfig;
  value?: RuleInputValue;
  editable?: boolean;
  setInput: (value: RuleInputValue) => void;
  setError: (error: string) => void;
}

function UserInput({
  inputType,
  data,
  value,
  editable = true,
  setInput,
  setError,
}: UserInputProps) {
  function setRestrictions(value: RuleInputValue) {
    if (data.type === "number" && typeof value === "string") {
      try {
        value = parseFloat(value);
      } catch (e) {
        setError(`${data.name} must be a number`);
        return;
      }
    }

    if (data.type === "integer" && typeof value === "string") {
      try {
        value = parseInt(value);
      } catch (e) {
        setError(`${data.name} must be an integer`);
        return;
      }
    }

    if ((data.type === "integer" || data.type === "number") && typeof value === "number") {
      if (data.min !== undefined && value < data.min && !(data.infinity && value === -1)) {
        setError(`${data.name} cannot be less than ${data.min}`);
        return;
      }
      if (data.max !== undefined && value > data.max) {
        setError(`${data.name} cannot be greater than ${data.max}`);
        return;
      }
    }
    setInput(value);
  }
  // The backend pairs display with type: checkboxes hold booleans, sliders and inputs numbers.
  return inputType === "input" ? (
    <TextInput
      data={data}
      setInput={setRestrictions}
      value={value as string | number | undefined}
      editable={editable}
    />
  ) : inputType === "slider" ? (
    <SliderInput
      data={data}
      setInput={setRestrictions}
      value={value as number | undefined}
      editable={editable}
    />
  ) : inputType === "checkbox" ? (
    <CheckboxInput
      data={data}
      setInput={setRestrictions}
      value={value as boolean | undefined}
      editable={editable}
    />
  ) : null;
}

export { UserInput };
