import type { UserProfile } from "@/features/user/types/user-profile";

export interface MapLeaderboardEntry {
  user: UserProfile;
  average_score: number;
  average_distance: number;
  average_time: number;
  rounds: number;
  rank: number;
}

export interface MapLeaderboardPage {
  data: MapLeaderboardEntry[];
  pages: number;
}
