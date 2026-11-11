import type { DuelsStateTeam } from "@/features/duels/types/duels-state-team";
import type { TeamMarker } from "@/features/duels/types/team-marker";
import type { GameStateName } from "@/features/game/types/game-state-name";

export interface DuelsState {
  state: GameStateName;
  round?: number;
  multi?: number;
  start_hp?: number;
  guess_count?: number;
  max_guesses?: number;
  teams?: DuelsStateTeam[];
  user?: string;
  spectating?: boolean;
  can_guess?: boolean;
  plonks?: TeamMarker[];
  guesses?: TeamMarker[];
  next_round?: string;
  now?: string;
}
