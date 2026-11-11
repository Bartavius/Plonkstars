import type { GameStateName } from "@/features/game/types/game-state-name";

export interface LiveState {
  state: GameStateName;
  round?: number;
  guess?: number;
  player?: number;
  score?: number;
  guessed?: boolean;
  lat?: number;
  lng?: number;
}
