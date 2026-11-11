import type { DuelsSummaryGuess } from "@/features/duels/types/duels-guess";
import type { DuelsTeam } from "@/features/duels/types/duels-team";
import type { LatLng } from "@/features/maps/types/lat-lng";
import type { MapBounds } from "@/features/maps/types/map-bounds";

export interface DuelsSummaryRound {
  hp: number;
  guesses: DuelsSummaryGuess[];
}

export interface DuelsSummaryTeam {
  team: DuelsTeam;
  rounds: DuelsSummaryRound[];
}

export interface DuelsSummaryLocation extends LatLng {
  multi: number;
}

export interface DuelsSummaryResponse {
  teams: DuelsSummaryTeam[];
  start_hp: number;
  rounds: DuelsSummaryLocation[];
  map_bounds: MapBounds;
}
