import type { LatLng } from "@/features/maps/types/lat-lng";
import type { UserProfile } from "@/features/user/types/user-profile";

import type { GuessResult } from "./guess-result";

export interface SummaryUser {
  user: UserProfile;
  score: number;
  distance: number;
  time: number;
  rank?: number;
  guesses: GuessResult[];
}

export interface GameSummary {
  this_user: string;
  users: SummaryUser[];
  rounds: LatLng[];
}
