import type { GameStateName } from "./game-state-name";

export interface GameStateEvent {
  state: GameStateName;
}
