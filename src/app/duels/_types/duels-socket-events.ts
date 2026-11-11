import type { TeamMarker } from "@/features/duels/types/team-marker";

export interface DuelsGuessNotice {
  user: string;
}

export type DuelsGuessEvent = TeamMarker | DuelsGuessNotice;

export interface DuelsTimeEvent {
  time: string;
  time_limit: number;
}
