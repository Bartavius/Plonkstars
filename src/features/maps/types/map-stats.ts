export interface MapStatHolder {
  user: string;
  stat: number;
}

export interface MapAggregateStats {
  average_generation_time: number;
  average_score: number;
  average_distance: number;
  average_time: number;
  total_guesses: number;
  max_distance: number;
}

export interface UserMapAverage {
  score: number;
  distance: number;
  time: number;
  guesses: number;
}

export interface UserMapHigh {
  score: number;
  distance: number;
  time: number;
  rounds: number;
  session: string;
}

export interface UserMapStats {
  average: UserMapAverage;
  high?: UserMapHigh;
}

export interface MapOtherStats {
  "5ks": number;
  top_guesses?: MapStatHolder;
  most_5ks?: MapStatHolder;
  fastest_5k?: MapStatHolder;
  highest_score?: MapStatHolder;
  fastest_nk?: MapStatHolder;
}

export interface MapStats {
  name: string;
  id: string;
  creator: string;
  description?: string;
  map_stats: MapAggregateStats;
  user_stats?: UserMapStats;
  other: MapOtherStats;
}
