import type { MapSummary } from "./map-summary";

export interface MapSearchResponse {
  maps: MapSummary[];
  pages: number;
}
