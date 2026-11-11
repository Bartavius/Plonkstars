export type RuleKey =
  | "rounds"
  | "time"
  | "nmpz"
  | "hp"
  | "guess_time"
  | "multi_start"
  | "multi_mult"
  | "multi_add"
  | "mult_freq";

export interface RuleConfig {
  key: RuleKey;
  // A string from the backend; app/game/page.tsx swaps the NMPZ label for JSX.
  name: string | React.ReactElement;
  type: "integer" | "number" | "boolean";
  display: "slider" | "input" | "checkbox";
  min?: number;
  max?: number;
  step?: number;
  infinity?: boolean;
  default: string | boolean | null;
  format?: string;
}
