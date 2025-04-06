import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface Location {
    lat: number;
    lng: number;
}
export default function FitBounds({ locations, options, summary}: { locations: Location[], options?: any, summary?: boolean }) {
  const map = useMap();

  let topLeftLat = 90;
  let topLeftLng = 180;
  let bottomRightLat = -90;
  let bottomRightLng = -180;

  for (let i = 0; i < locations.length; i++) {
    topLeftLat = Math.min(topLeftLat, locations[i].lat);
    topLeftLng = Math.min(topLeftLng, locations[i].lng);
    bottomRightLat = Math.max(bottomRightLat, locations[i].lat);
    bottomRightLng = Math.max(bottomRightLng, locations[i].lng);
  }

  console.log(locations, topLeftLat, topLeftLng, bottomRightLat, bottomRightLng);
  const dependencies = summary ? [] : [locations];

  useEffect(() => {
    if (map && locations.length > 0) {
      const bounds: L.LatLngBoundsExpression = [
        [topLeftLat, topLeftLng],
        [bottomRightLat, bottomRightLng],
      ];
      map.fitBounds(bounds, options);
    }
  }, dependencies);

  return null;
};
