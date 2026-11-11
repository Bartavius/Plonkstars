import { MapContainer, useMapEvents } from "react-leaflet";

import type { DuelsUser } from "@/features/duels/types/duels-user";
import type { TeamMarker } from "@/features/duels/types/team-marker";
import type { MapBounds } from "@/features/maps/types/map-bounds";
import { useAppSelector } from "@/store/use-app-selector";

import { FitBounds } from "./fit-bounds";
import { MapIcon } from "./map-icon";
import { MapTileLayer } from "./map-tile-layer";
import "./map.css";
interface TeamGuessingMapProps {
  guesses: Record<string, TeamMarker>;
  plonks: Record<string, TeamMarker>;
  users: Record<string, DuelsUser>;
  mapBounds: MapBounds;
  onClick: (lat: number, lng: number) => void;
}

function TeamGuessingMap({ guesses, plonks, users, mapBounds, onClick }: TeamGuessingMapProps) {
  const res = useAppSelector((state) => state.settings.miniMapResolution);

  const ClickHandler = () => {
    useMapEvents({
      click(e) {
        onClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer zoomDelta={2} wheelPxPerZoomLevel={2} zoomControl={false} className="leaflet-map">
      <ClickHandler />
      <MapTileLayer size={res} offset={8 - Math.log2(res)} />
      <FitBounds locations={[mapBounds.start, mapBounds.end]} summary={false} />
      <div>
        {Object.keys(plonks).map((key) => {
          const plonk = plonks[key];
          const user = users[key];
          if (!plonk || !user || !plonk.lat || !plonk.lng) {
            return null;
          }
          return (
            <MapIcon
              key={key}
              pos={plonk}
              customize={user.user_cosmetics}
              iconUrl={"/PlonkStarsAvatar.png"}
              iconPercent={0.55}
            />
          );
        })}
      </div>
      <div>
        {Object.keys(guesses).map((key) => {
          const guess = guesses[key];
          const user = users[key];
          if (!guess || !user || !guess.lat || !guess.lng) {
            return null;
          }
          return (
            <MapIcon key={key} pos={guess} iconUrl="/PlonkStarsMarker.png" iconPercent={0.55} />
          );
        })}
      </div>
    </MapContainer>
  );
}

export { TeamGuessingMap };
