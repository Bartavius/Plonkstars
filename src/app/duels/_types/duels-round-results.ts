import type { DuelsGuess } from "@/features/duels/types/duels-guess";
import type { DuelsTeam } from "@/features/duels/types/duels-team";

export interface DuelsTeamResult {
  team: DuelsTeam;
  prev_hp: number;
  hp: number;
  guesses: DuelsGuess[];
}

export interface DuelsRoundResults {
  lat: number;
  lng: number;
  start_hp: number;
  round_number: number;
  multi: number;
  teams: DuelsTeamResult[];
}
