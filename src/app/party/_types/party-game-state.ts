import type { GameTypeName } from "@/features/game/types/game-type-name";

export interface PartyGameState {
  state: "lobby" | "playing";
  id?: string;
  type?: GameTypeName;
  joined?: boolean;
}
