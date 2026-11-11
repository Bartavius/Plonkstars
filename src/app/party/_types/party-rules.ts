import type { GameTypeName } from "@/features/game/types/game-type-name";
import type { MapSummary } from "@/features/maps/types/map-summary";

export interface PartyRules {
  map: MapSummary;
  rounds: number;
  time: number;
  type: GameTypeName;
  nmpz: boolean;
  team_type: "solo" | "team" | null;
  hp?: number;
  multi_start?: number;
  multi_mult?: number;
  multi_add?: number;
  mult_freq?: number;
  guess_time?: number;
}
