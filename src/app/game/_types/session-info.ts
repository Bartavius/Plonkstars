import type { GameStateName } from "@/features/game/types/game-state-name";
import type { MapSummary } from "@/features/maps/types/map-summary";

export interface SessionRules {
  NMPZ: boolean;
  time: number;
  rounds: number;
}

export interface SessionInfo {
  map: MapSummary;
  host: string;
  rules: SessionRules;
  state: GameStateName;
}
