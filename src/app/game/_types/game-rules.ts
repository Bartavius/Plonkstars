import type { RuleKey } from "@/features/game/types/rule-config";
import type { RuleInputValue } from "@/features/game/types/rule-input-value";

export interface GameRules extends Partial<Record<RuleKey, RuleInputValue>> {
  mapName?: string;
  map_id?: string;
  time?: number;
  rounds?: number;
  nmpz?: boolean;
}
