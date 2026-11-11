import type { GuessResult } from "@/features/challenge/types/guess-result";
import type { LatLng } from "@/features/maps/types/lat-lng";
import type { UserProfile } from "@/features/user/types/user-profile";

export interface MapBestGame {
  user: UserProfile;
  rounds: LatLng[];
  guesses: GuessResult[];
  score: number;
  distance: number;
  time: number;
}
