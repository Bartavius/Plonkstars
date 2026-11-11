import type { GameStateName } from "@/features/game/types/game-state-name";

export interface ChallengeState {
  state: GameStateName;
  round?: number;
  score?: number;
  lat?: number;
  lng?: number;
}
