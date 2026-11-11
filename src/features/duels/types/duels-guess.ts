export interface DuelsGuess {
  user: string;
  lat: number;
  lng: number;
  score: number;
  distance: number;
  time: number;
}

export interface DuelsSummaryGuess extends DuelsGuess {
  rank: number;
}
