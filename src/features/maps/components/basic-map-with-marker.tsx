"use client";

import { MapContainer, useMapEvents } from "react-leaflet";

import type { UserIconCosmetics } from "@/features/cosmetics/types/user-icon-cosmetics";
import type { MapBounds } from "@/features/maps/types/map-bounds";
import { useAppSelector } from "@/store/use-app-selector";

import { FitBounds } from "./fit-bounds";
import "./map.css";
import { MapTileLayer } from "./map-tile-layer";
import { MapIcon } from "./map-icon";
interface BasicMapWithMarkerProps {
  lat?: number;
  lng?: number;
  setPos: (lat: number, lng: number) => void;
  mapBounds: MapBounds;
  cosmetics?: UserIconCosmetics;
}

function BasicMapWithMarker({ lat, lng, setPos, mapBounds, cosmetics }: BasicMapWithMarkerProps) {
  const res = useAppSelector((state) => state.settings.miniMapResolution);

  const ClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPos(lat, lng);
      },
    });
    return null;
  };

  return (
    <MapContainer zoomDelta={2} wheelPxPerZoomLevel={2} zoomControl={false} className="leaflet-map">
      <MapTileLayer size={res} offset={8 - Math.log2(res)} />
      <ClickHandler />
      {lat && lng && (
        <MapIcon
          pos={{ lat, lng }}
          customize={cosmetics}
          iconUrl="/PlonkStarsAvatar.png"
          iconPercent={0.55}
        />
      )}
      <FitBounds locations={[mapBounds.start, mapBounds.end]} summary={false} />
    </MapContainer>
  );
}

export { BasicMapWithMarker };
