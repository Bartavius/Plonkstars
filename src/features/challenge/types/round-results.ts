import type { LatLng } from "@/features/maps/types/lat-lng";
import type { UserProfile } from "@/features/user/types/user-profile";

import type { GuessResult } from "./guess-result";

export interface RoundResultUser {
  user: UserProfile;
  score: number;
  distance: number;
  time: number;
  rank: number;
  guess: GuessResult;
}

export interface RoundResults {
  round: number;
  correct: LatLng;
  this_user: string;
  users: RoundResultUser[];
}
