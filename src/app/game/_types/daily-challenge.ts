import type { SessionInfo } from "./session-info";

export interface DailyChallenge extends SessionInfo {
  next: string;
  now: string;
  id: string;
}
