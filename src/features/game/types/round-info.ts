import type { MapBounds } from "@/features/maps/types/map-bounds";

export interface RoundInfo {
  round: number;
  lat: number;
  lng: number;
  nmpz: boolean;
  map_bounds: MapBounds;
  time?: string;
  time_limit?: number;
  now?: string;
}
