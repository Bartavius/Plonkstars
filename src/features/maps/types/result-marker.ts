import type { GuessResult } from "@/features/challenge/types/guess-result";
import type { UserProfile } from "@/features/user/types/user-profile";

import type { LatLng } from "./lat-lng";

export interface MarkerGuess extends GuessResult {
  user: UserProfile;
}

export interface ResultMarker {
  correct: LatLng;
  users: MarkerGuess[];
}
